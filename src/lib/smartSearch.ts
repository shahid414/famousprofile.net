/**
 * Shared smart-search core — the single source of truth for ProfileBook search.
 *
 * Used by:
 * - src/app/api/search/route.ts (search dropdown, fast/light: 1 Wikipedia
 *   query, plus a conditional 2nd query only for new-generation country
 *   searches; deep mode for the homepage live search and pagination)
 * - src/app/search/page.tsx (full results page: deep discovery)
 * - src/app/api/wiki/search/route.ts (legacy shape, smart core)
 *
 * Pipeline: parse intent -> score local profiles -> diversity-select ->
 * fetch Wikipedia with intent-derived queries -> filter + dedup -> rank ->
 * (optionally) group local results by era for the results page.
 *
 * Deep mode (opts.deep): one "<Demonym> <profession>" Wikipedia query per
 * profession in parallel (see wikiDiscovery.ts), 100 results fetched per
 * query, and a much larger wiki cap — so a country search discovers dozens
 * of personalities instead of stopping at 8-10. Relevance filtering is
 * identical in both modes; only the discovery breadth and the caps change.
 *
 * Backwards compatibility: the local/wikipedia item shapes are identical to
 * the previous API responses, so SearchBar works unchanged.
 */

import { getAllProfiles, getAllCategories, getAllCountries } from "@/lib/data";
import { isFamousPersonality } from "@/lib/wikiFilter";
import { buildDiscoveryQueries } from "./wikiDiscovery";
import {
  parseSearchIntent,
  findDemonymMentions,
  demonymFor,
  normalizeCountryForMatch,
  bornInPhrases,
  type SearchIntent,
} from "./searchIntent";
import {
  scoreLocalProfile,
  selectDiverse,
  eraBucketOf,
  eraBonus,
  parseWikiYears,
  wikiEraBucket,
  wikiEraCompatible,
  normalizeName,
  scoreNameMatch,
  nameTokens,
  normalizeForMatch,
  wikiKeyToSlug,
  ERA_GROUP_TITLES,
  ERA_GROUP_NOTES,
  type EraBucket,
} from "./searchRank";
import type { Profile } from "@/types";

export interface LocalSearchItem {
  type: "local";
  slug: string;
  name: string;
  category: string;
  profession: string;
  country: string;
  industry?: string;
  image: string;
  imageCredit: string;
  bio: string;
  url: string;
}

export interface WikiSearchItem {
  type: "wikipedia";
  id: number;
  key: string;
  name: string;
  description: string;
  excerpt: string;
  thumbnail: string | null;
  url: string;
}

export interface SearchGroup {
  key: EraBucket;
  title: string;
  note: string;
  items: LocalSearchItem[];
}

export interface SmartSearchResult {
  query: string;
  intent: SearchIntent;
  local: LocalSearchItem[];
  /** Total local matches before the diversity cap. */
  localTotal: number;
  wikipedia: WikiSearchItem[];
  /** Total Wikipedia matches after filtering, before the wiki cap — the
   *  size of the discoverable pool (deep mode). Equals wikiCount in
   *  light mode. */
  wikiTotal: number;
  localCount: number;
  wikiCount: number;
  totalCount: number;
  /** Era groups of the selected local results (results page only). */
  groups: SearchGroup[];
  /** Deep-mode pipeline counters (measured, not estimated) — present only
   *  when deep discovery ran. Shows where candidate results were lost. */
  stats?: DiscoveryStats;
}

/** Measured counters for one deep-discovery run. */
export interface DiscoveryStats {
  /** Wikipedia queries actually run. */
  queriesRun: number;
  /** Raw pages returned by Wikipedia across all queries. */
  fetched: number;
  /** After the isFamousPersonality person check. */
  afterPerson: number;
  /** After the primary-country check (country intents only). */
  afterCountry: number;
  /** After the profession check (profession intents only). */
  afterProfession: number;
  /** After the era check (era intents only). */
  afterEra: number;
  /** After dedup against the local directory + across queries. */
  afterDedup: number;
  /** Wall time of the Wikipedia discovery leg, in milliseconds. */
  discoveryMs: number;
}

export interface SmartSearchOptions {
  /** Max local results to return (dropdown: 8, results page: 24). */
  localCap?: number;
  /** Max Wikipedia results to return (dropdown: 8, results page: 10 light,
   *  300 deep). */
  wikiCap?: number;
  /** Max Wikipedia queries to run (dropdown: 1 for speed — raised to 2
   *  only for new-generation country searches; page light: 3). Ignored in
   *  deep mode, where the discovery builder decides the query set. */
  maxWikiQueries?: number;
  /** Build era groups for the results page. */
  includeGroups?: boolean;
  /** Deep discovery: multi-profession Wikipedia queries in parallel,
   *  100 results fetched per query, larger wiki cap. */
  deep?: boolean;
  /** Wikipedia results fetched per query (default 40; deep defaults to 100 —
   *  the REST endpoint's verified maximum). */
  fetchLimit?: number;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&");
}

const WIKI_USER_AGENT =
  "ProfileBookApp/1.0 (https://profilebook.org; contact@profilebook.org)";

/**
 * Extra profession words accepted for the "athletes" category in the
 * Wikipedia profession check: Wikipedia describes sportspeople by their
 * sport ("triple jumper", "footballer", "boxer"), not by the word athlete.
 */
const ATHLETE_SYNONYMS = [
  "athlete", "athletes", "footballer", "footballers", "cricketer", "cricketers",
  "boxer", "boxers", "wrestler", "wrestlers", "swimmer", "swimmers",
  "runner", "runners", "jumper", "jumpers", "thrower", "throwers",
  "diver", "divers", "sprinter", "sprinters", "hurdler", "hurdlers",
  "gymnast", "gymnasts", "golfer", "golfers", "cyclist", "cyclists",
  "skater", "skaters", "skier", "skiers", "rower", "rowers", "sailor",
  "shooter", "archer", "fencer", "judoka", "decathlete", "heptathlete",
  "pentathlete", "triathlete", "weightlifter", "surfer", "snowboarder",
  "climber", "marathoner", "racewalker", "midfielder", "goalkeeper",
  "defender", "striker", "tennis player", "football player", "soccer player",
  "player",
];

interface RawWikiPage {
  id: number;
  key: string;
  title: string;
  description?: string;
  excerpt?: string;
  thumbnail?: { url?: string };
}

async function fetchWikiPages(query: string, limit = 40): Promise<RawWikiPage[]> {
  const endpoint = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(
    query
  )}&limit=${limit}`;
  try {
    const res = await fetch(endpoint, {
      headers: { "User-Agent": WIKI_USER_AGENT, Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.pages || []) as RawWikiPage[];
  } catch (err) {
    console.warn("Wikipedia live search fetch error in smart search:", err);
    return [];
  }
}

/**
 * Deep-discovery pool cache (server-side, in-memory).
 *
 * A deep run fires 12-16 parallel Wikipedia queries and takes 1-3s. The
 * results page and the /api/search pagination endpoint both slice the SAME
 * pool, so the pool is cached by normalized query + options for 10 minutes:
 * Load More clicks then cost ~10ms instead of re-running discovery, and
 * pagination stays stable (no duplicates or reshuffling between pages).
 * Light (dropdown) calls are never cached here — they are cheap and fast.
 */
const DEEP_CACHE_TTL_MS = 10 * 60 * 1000;
const DEEP_CACHE_MAX_ENTRIES = 50;
const deepCache = new Map<string, { at: number; result: SmartSearchResult }>();

function deepCacheGet(key: string): SmartSearchResult | null {
  const entry = deepCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > DEEP_CACHE_TTL_MS) {
    deepCache.delete(key);
    return null;
  }
  return entry.result;
}

function deepCacheSet(key: string, result: SmartSearchResult): void {
  if (deepCache.size >= DEEP_CACHE_MAX_ENTRIES) {
    // Drop the oldest entry (Map preserves insertion order).
    const oldest = deepCache.keys().next().value;
    if (oldest !== undefined) deepCache.delete(oldest);
  }
  deepCache.set(key, { at: Date.now(), result });
}

function toLocalItem(p: Profile): LocalSearchItem {
  return {
    type: "local",
    slug: p.slug,
    name: p.name,
    category: p.category,
    profession: p.profession,
    country: p.country,
    industry: p.industry,
    image: p.image,
    imageCredit: p.imageCredit,
    bio: p.bio.slice(0, 140) + "...",
    url: `/people/${p.slug}`,
  };
}

/**
 * Wikipedia's REST search returns 60px-wide thumbnails — too small for
 * the 96px result cards (and worse on retina displays), so they render
 * blurry. Wikimedia's thumbnail service only serves a fixed set of
 * widths (60, 120, 330, 500, ...); any other width returns HTTP 400
 * (verified live 2026-11-26: 320px -> 400, 330px -> 200). Rewriting the
 * "/NNNpx-" segment of a thumb.wikimedia.org URL to 330px therefore
 * serves a crisp image at card size (Next's optimizer downscales from
 * there for the 44px dropdown avatars). Non-thumb URLs pass through
 * unchanged, and a missing thumbnail stays null (cards show initials).
 */
const HD_THUMB_WIDTH = 330;
function hdThumbnail(url: string | null): string | null {
  if (!url || !url.includes("thumb.wikimedia.org")) return url;
  return url.replace(/\/\d+px-/, `/${HD_THUMB_WIDTH}px-`);
}

function toWikiItem(page: RawWikiPage): WikiSearchItem {
  let thumbnailUrl: string | null = null;
  if (page.thumbnail && page.thumbnail.url) {
    thumbnailUrl = page.thumbnail.url.startsWith("//")
      ? `https:${page.thumbnail.url}`
      : page.thumbnail.url;
  }
  return {
    type: "wikipedia",
    id: page.id,
    key: page.key,
    name: page.title,
    description: page.description || "Public Figure (Wikipedia)",
    excerpt: page.excerpt ? stripHtml(page.excerpt) : "",
    thumbnail: hdThumbnail(thumbnailUrl),
    // /people/[slug] renders Wikipedia personalities dynamically
    // (Scenario 2), so a wiki result links to its own profile page.
    url: `/people/${encodeURIComponent(wikiKeyToSlug(page.key))}`,
  };
}

export async function smartSearch(
  rawQuery: string,
  opts: SmartSearchOptions = {}
): Promise<SmartSearchResult> {
  const {
    localCap = 8,
    maxWikiQueries = 1,
    includeGroups = false,
    deep = false,
    fetchLimit = deep ? 100 : 40,
  } = opts;
  // Deep mode raises the Wikipedia cap (callers may still override it).
  // 300 keeps the paginable pool in the hundreds without unbounded memory:
  // the true filtered count is still visible in stats.afterDedup.
  const wikiCap = opts.wikiCap ?? (deep ? 300 : 8);

  const query = (rawQuery || "").trim();
  const countries = getAllCountries().map((c) => c.country);
  const categories = getAllCategories().map((c) => c.slug);
  const intent = parseSearchIntent(query, { countries, categories });

  const empty: SmartSearchResult = {
    query,
    intent,
    local: [],
    localTotal: 0,
    wikipedia: [],
    wikiTotal: 0,
    localCount: 0,
    wikiCount: 0,
    totalCount: 0,
    groups: [],
  };
  if (!query) return empty;

  // Deep mode: serve the cached pool when the same query + options ran
  // recently, so pagination and repeat searches do not re-hit Wikipedia.
  const cacheKey = deep
    ? JSON.stringify([query.toLowerCase(), localCap, wikiCap, includeGroups])
    : null;
  if (cacheKey) {
    const cached = deepCacheGet(cacheKey);
    if (cached) return cached;
  }

  // ---- Local search: score every profile, then diversity-select ----
  const allProfiles = getAllProfiles();
  const seenSlugs = new Set<string>();
  const scored = allProfiles
    .map((p) => ({ profile: p, score: scoreLocalProfile(p, intent) }))
    .filter((s) => s.score >= 0)
    .sort((a, b) => b.score - a.score || a.profile.name.localeCompare(b.profile.name))
    .filter((s) => {
      // The dataset has duplicate records (e.g. Nikola Tesla in both
      // inventors.json and scientists.json under the same slug) — never
      // return the same profile twice (2026-11-25 accuracy audit).
      if (seenSlugs.has(s.profile.slug)) return false;
      seenSlugs.add(s.profile.slug);
      return true;
    });
  const localTotal = scored.length;
  const selected = selectDiverse(scored, localCap, intent);
  const local = selected.map((s) => toLocalItem(s.profile));

  // ---- Wikipedia discovery with intent-derived queries ----
  let wikipedia: WikiSearchItem[] = [];
  let wikiTotal = 0;
  let stats: DiscoveryStats | undefined;
  // Deep mode runs the multi-profession discovery set (wikiDiscovery.ts);
  // light mode keeps the original 1-3 queries so the dropdown stays fast.
  const wikiQueries = deep
    ? buildDiscoveryQueries(intent, "deep")
    : (() => {
        // New-generation country searches (dropdown): plain
        // "<Demonym> actor" queries return Wikipedia's most relevant
        // actors — almost none born after 2000 (measured 1-3 per 100,
        // 2026-11-26) — so the dropdown found almost no new-generation
        // people. Birth-year queries surface them directly ("<Demonym>
        // actor born 2000" yields 30+ verified post-2000 births per
        // 100). Three queries, still fast (parallel, limit 40); every
        // other intent keeps its existing query set and counts, and the
        // era hard filter is untouched.
        if (intent.era === "new" && intent.kind === "country" && intent.demonym) {
          return [
            `${intent.demonym} actor born 2000`,
            `${intent.demonym} singer born 2000`,
            `${intent.demonym} footballer born 2000`,
          ];
        }
        return intent.wikiQueries.slice(0, Math.max(0, maxWikiQueries));
      })();
  if (wikiQueries.length > 0) {
    const discoveryStart = Date.now();
    // Fetch in batches of 8: deep new-generation searches run up to 36
    // queries, and firing them all at once intermittently trips
    // Wikipedia/proxy throttling (whole queries come back empty —
    // measured 2026-11-26: back-to-back deep searches fetched 1400 of
    // 3600 pages). Batched fetches keep the same coverage reliably.
    const pagesPerQuery: RawWikiPage[][] = [];
    for (let i = 0; i < wikiQueries.length; i += 8) {
      const batch = wikiQueries.slice(i, i + 8);
      pagesPerQuery.push(
        ...(await Promise.all(batch.map((q) => fetchWikiPages(q, fetchLimit))))
      );
    }
    const discoveryMs = Date.now() - discoveryStart;

    const localNames = new Set(local.map((l) => normalizeName(l.name)));
    // Dedup against the ENTIRE local directory, not just the query
    // matches: a Wikipedia hit for someone who already has a permanent
    // local profile (e.g. Messi on a "Cristiano Ronaldo" search) must
    // never appear as a Wikipedia result — the local profile is the
    // canonical one and its URL is the one to use.
    const allLocalNames = new Set(allProfiles.map((p) => normalizeName(p.name)));
    const allLocalSlugs = new Set(allProfiles.map((p) => p.slug));
    const seenWikiNames = new Set<string>();

    interface ScoredWiki {
      page: RawWikiPage;
      score: number;
      birthYear: number | null;
      deathYear: number | null;
      queryIndex: number;
    }
    const candidates: ScoredWiki[] = [];
    // Measured pipeline counters — where candidate results are lost.
    // A stage that does not apply to this intent counts as passed.
    let fetched = 0;
    let afterPerson = 0;
    let afterCountry = 0;
    let afterProfession = 0;
    let afterEra = 0;
    // Person intents: the requested name, tokenized once for the
    // Wikipedia name-relevance gate below.
    const personTokens =
      intent.kind === "person" && intent.personQuery
        ? nameTokens(intent.personQuery)
        : [];
    const processPages = (pages: RawWikiPage[], qi: number) => {
      fetched += pages.length;
      pages.forEach((page, pi) => {
        const normName = normalizeName(page.title);
        const slug = wikiKeyToSlug(page.key);
        if (allLocalNames.has(normName) || allLocalSlugs.has(slug)) return; // local duplicate
        if (localNames.has(normName)) return;
        if (seenWikiNames.has(normName)) return; // duplicate across wiki queries
        if (
          !isFamousPersonality({
            title: page.title,
            description: page.description,
            excerpt: page.excerpt,
          })
        ) {
          return;
        }
        afterPerson++;
        // Person intents (2026-11-26 audit): a Wikipedia candidate must
        // actually BE the requested person. Wikipedia's text search
        // returns relatives, coaches, event articles, and — for typo'd
        // queries — complete strangers ("Jackie Chn" returned a racing
        // driver and a basketball player). Gate: the article title
        // (minus its parenthetical disambiguator) must match the
        // requested name exactly, by tokens, or within the typo budget
        // (scoreNameMatch >= 60), OR the excerpt lead must contain every
        // name token (stage names / real names: "Abel Tesfaye" -> "The
        // Weeknd", "SRK" -> "Shah Rukh Khan"). The title score is added
        // to the ranking below, so an exact-title article always leads
        // the Wikipedia section.
        let personTitleScore = 0;
        if (intent.kind === "person" && intent.personQuery) {
          const titleBase = page.title.replace(/\([^)]*\)\s*$/, "").trim();
          personTitleScore = scoreNameMatch(intent.personQuery, titleBase);
          if (personTitleScore < 60) {
            const excerptLeadTokens = nameTokens(
              (page.excerpt ? stripHtml(page.excerpt) : "").slice(0, 200)
            );
            const excerptHasName =
              personTokens.length > 0 &&
              personTokens.every((t) => excerptLeadTokens.includes(t));
            if (!excerptHasName) return;
            personTitleScore = 15; // excerpt-only match: related, ranks low
          }
        }
        // Country intents: the result's PRIMARY association must be that
        // country. Wikipedia's search matches article TEXT, so a query
        // like "Mexican actor" can return a British actor whose article
        // merely mentions Mexico, or "American and Mexican actor" (whose
        // primary association is American). The FIRST demonym mentioned
        // across the title's parenthetical + description + excerpt
        // decides: "Mexican-American actor" is primarily Mexican and
        // passes; "American and Mexican actor" is primarily American and
        // is rejected. A "born in <country>" statement counts only when
        // it precedes any other country's demonym.
        // (2026-11-25 accuracy audit) Only the title's PARENTHETICAL
        // disambiguator contributes — a stage name such as "Apache
        // Indian" must not count as Indian. England/Scotland/Wales
        // count as the United Kingdom, and "New Mexico" never counts
        // as Mexico (see findDemonymMentions).
        if (intent.country && (intent.kind === "country" || intent.kind === "country+profession")) {
          const titleParen = (page.title.match(/\(([^)]*)\)\s*$/) || [])[1] || "";
          const excerptText = page.excerpt ? stripHtml(page.excerpt) : "";
          const combined = `${titleParen} ${page.description || ""} ${excerptText}`;
          const mentions = findDemonymMentions(combined);
          const targetNorm = normalizeCountryForMatch(intent.country);
          const bornInPositions = bornInPhrases(intent.country)
            .map((p) => combined.toLowerCase().indexOf(p))
            .filter((i) => i !== -1);
          const bornInIdx = bornInPositions.length > 0 ? Math.min(...bornInPositions) : -1;
          const primaryIsOurs =
            mentions.length > 0
              ? normalizeCountryForMatch(mentions[0].country) === targetNorm ||
                (bornInIdx !== -1 && bornInIdx < mentions[0].index)
              : bornInIdx !== -1;
          if (!primaryIsOurs) return;
          // Description-contradiction guard: a title disambiguator alone
          // is not enough when the description itself leads with a
          // different nationality and never mentions the target — e.g.
          // "Robert Lee (British actor)" is a Chinese actor, and
          // "Apache Indian" is a British singer. Compound identities
          // ("British Pakistani", "Indian-born American") still pass
          // because the description itself contains the target demonym;
          // national-team players pass because the excerpt names the
          // target's national team.
          const descMentions = findDemonymMentions(page.description || "");
          if (
            descMentions.length > 0 &&
            normalizeCountryForMatch(descMentions[0].country) !== targetNorm
          ) {
            const descHasTarget = descMentions.some(
              (mm) => normalizeCountryForMatch(mm.country) === targetNorm
            );
            const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const nationalTeamRe = new RegExp(
              `\\b(?:${esc(intent.country)}|${esc(demonymFor(intent.country))})\\s+national\\b`,
              "i"
            );
            if (!descHasTarget && !nationalTeamRe.test(excerptText)) return;
          }
        }
        afterCountry++;
        // Profession intents: the description must state the profession
        // (or a recognized synonym) — a title match against a list
        // article is not enough. A "Mexican musician" is NOT a singer,
        // and a "Mexican footballer" is NOT a singer either.
        if (
          intent.profession &&
          (intent.kind === "country+profession" || intent.kind === "profession") &&
          intent.professionSynonyms
        ) {
          const synonyms =
            intent.profession === "athletes"
              ? [...intent.professionSynonyms, ...ATHLETE_SYNONYMS]
              : intent.professionSynonyms;
          const hay = `${page.title} ${page.description || ""}`.toLowerCase();
          if (!synonyms.some((s) => hay.includes(s.toLowerCase()))) return;
        }
        afterProfession++;
        // Era intents: the era must be VERIFIABLE from the item's own
        // text. An item with no parseable birth/death year is excluded
        // (its era cannot be verified — never guessed), and an item
        // from the wrong era is excluded too. No backfilling.
        const years = parseWikiYears({
          description: page.description,
          excerpt: page.excerpt,
        });
        if (intent.era) {
          if (years.birthYear === null && years.deathYear === null) return;
          if (!wikiEraCompatible(years.birthYear, years.deathYear !== null, intent.era)) return;
        }
        afterEra++;
        seenWikiNames.add(normName);
        // Base score: Wikipedia relevance order (first query wins ties).
        let score = 100 - qi * 5 - pi * 2;
        // Person intents: the name-match quality dominates Wikipedia's
        // order, so the exact-title article leads the Wikipedia section.
        if (personTitleScore > 0) score += personTitleScore;
        const { birthYear, deathYear } = years;
        score += Math.max(-25, Math.min(25, eraBonus(birthYear, deathYear !== null, intent.era)));
        // Profession-word bonus (e.g. description "Mexican actor" for an actors search).
        if (intent.professionWord) {
          const hay = `${page.title} ${page.description || ""}`.toLowerCase();
          const w = intent.professionWord.toLowerCase();
          if (hay.includes(w) || hay.includes(`${w}s`)) score += 10;
        }
        candidates.push({ page, score, birthYear, deathYear, queryIndex: qi });
      });
    };
    pagesPerQuery.forEach((pages, qi) => processPages(pages, qi));

    // Typo fallback (person intents only): if the raw query produced no
    // usable Wikipedia candidate — Wikipedia returns nothing for
    // "Cristiano Ronlado" and junk for "Elon Msk" — retry once with the
    // longest name token ("Cristiano", "Elon"), which Wikipedia resolves
    // to the right person; the name-relevance gate above (fuzzy token
    // matching) then keeps only the genuinely matching articles. One
    // extra fetch, only on the zero-result path.
    if (intent.kind === "person" && candidates.length === 0 && personTokens.length >= 2) {
      const longest = [...personTokens].sort((a, b) => b.length - a.length)[0];
      const fallbackPages = await fetchWikiPages(longest, fetchLimit);
      processPages(fallbackPages, wikiQueries.length);
    }

    let picked: ScoredWiki[];
    if (deep) {
      // Deep picking: round-robin across queries so every profession
      // contributes (a pure score sort would let the first 2-3 queries
      // fill the whole cap — that is how "Famous People from USA" ended
      // up all actors), then re-sort the picked set by relevance.
      const byQuery = new Map<number, ScoredWiki[]>();
      for (const c of [...candidates].sort((a, b) => b.score - a.score)) {
        const list = byQuery.get(c.queryIndex) || [];
        list.push(c);
        byQuery.set(c.queryIndex, list);
      }
      const queryIndexes = Array.from(byQuery.keys()).sort((a, b) => a - b);
      picked = [];
      let progressed = true;
      while (picked.length < wikiCap && progressed) {
        progressed = false;
        for (const qi of queryIndexes) {
          if (picked.length >= wikiCap) break;
          const bucket = byQuery.get(qi)!;
          if (!bucket.length) continue;
          picked.push(bucket.shift()!);
          progressed = true;
        }
      }
      picked.sort((a, b) => b.score - a.score);
    } else {
      candidates.sort((a, b) => b.score - a.score);

      // Broad queries: interleave birth decades for era diversity, then append
      // items without a parseable birth year in relevance order.
      if (intent.kind === "person") {
        picked = candidates.slice(0, wikiCap);
      } else if (intent.era) {
        // Era intents: every candidate is already era-verified and
        // era-compatible — undated and wrong-era items were excluded
        // during filtering above. No backfilling, ever.
        picked = candidates.slice(0, wikiCap);
      } else {
        const byDecade = new Map<number, ScoredWiki[]>();
        const unknown: ScoredWiki[] = [];
        for (const c of candidates) {
          if (c.birthYear === null) unknown.push(c);
          else {
            const d = Math.floor(c.birthYear / 10) * 10;
            const list = byDecade.get(d) || [];
            list.push(c);
            byDecade.set(d, list);
          }
        }
        const decades = Array.from(byDecade.keys()).sort((a, b) =>
          intent.era === "historical" ? a - b : b - a
        );
        picked = [];
        let round = 0;
        while (picked.length < wikiCap) {
          let progressed = false;
          for (const d of decades) {
            if (picked.length >= wikiCap) break;
            const bucket = byDecade.get(d)!;
            if (!bucket.length) continue;
            picked.push(bucket.shift()!);
            progressed = true;
          }
          if (!progressed) break;
          if (++round > 30) break;
        }
        // Fill remaining slots with undated items in relevance order.
        while (picked.length < wikiCap && unknown.length) {
          picked.push(unknown.shift()!);
        }
        // If decades ran out early, top up with whatever is left.
        if (picked.length < wikiCap) {
          const pickedSet = new Set(picked);
          for (const c of candidates) {
            if (picked.length >= wikiCap) break;
            if (!pickedSet.has(c)) picked.push(c);
          }
        }
      }
    }

    wikipedia = picked.map((c) => toWikiItem(c.page));
    // wikiTotal must equal the pool actually available for pagination
    // (capped at wikiCap) — the true filtered count lives in
    // stats.afterDedup.
    wikiTotal = wikipedia.length;
    if (deep) {
      stats = {
        queriesRun: wikiQueries.length,
        fetched,
        afterPerson,
        afterCountry,
        afterProfession,
        afterEra,
        afterDedup: candidates.length,
        discoveryMs,
      };
    }
  }

  // ---- Era groups for the results page (local results only) ----
  let groups: SearchGroup[] = [];
  if (includeGroups && intent.kind !== "person" && local.length > 0) {
    const buckets = new Map<EraBucket, LocalSearchItem[]>();
    for (const item of local) {
      const profile = allProfiles.find((p) => p.slug === item.slug)!;
      const bucket = eraBucketOf(profile);
      const list = buckets.get(bucket) || [];
      list.push(item);
      buckets.set(bucket, list);
    }
    const order: EraBucket[] =
      intent.era === "historical"
        ? ["historical", "established", "modern", "new"]
        : ["new", "modern", "established", "historical"];
    groups = order
      .filter((k) => (buckets.get(k) || []).length > 0)
      .map((k) => ({
        key: k,
        title: ERA_GROUP_TITLES[k],
        note: ERA_GROUP_NOTES[k],
        items: buckets.get(k)!,
      }));
  }

  const result: SmartSearchResult = {
    query,
    intent,
    local,
    localTotal,
    wikipedia,
    wikiTotal,
    localCount: local.length,
    wikiCount: wikipedia.length,
    totalCount: local.length + wikipedia.length,
    groups,
    ...(stats ? { stats } : {}),
  };
  if (cacheKey) deepCacheSet(cacheKey, result);
  return result;
}

/** Re-exported for callers that need the wiki era of an already-mapped item. */
export { wikiEraBucket };
