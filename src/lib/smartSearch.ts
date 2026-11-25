/**
 * Shared smart-search core — the single source of truth for ProfileBook search.
 *
 * Used by BOTH:
 * - src/app/api/search/route.ts (search dropdown, fast: 1 Wikipedia query,
 *   plus a conditional 2nd query only for new-generation country searches)
 * - src/app/search/page.tsx (full results page: up to 3 Wikipedia queries)
 *
 * Pipeline: parse intent -> score local profiles -> diversity-select ->
 * fetch Wikipedia with intent-derived queries -> filter + dedup -> rank ->
 * (optionally) group local results by era for the results page.
 *
 * Backwards compatibility: the local/wikipedia item shapes are identical to
 * the previous API responses, so SearchBar works unchanged.
 */

import { getAllProfiles, getAllCategories, getAllCountries } from "@/lib/data";
import { isFamousPersonality } from "@/lib/wikiFilter";
import {
  parseSearchIntent,
  findDemonymMentions,
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
  localCount: number;
  wikiCount: number;
  totalCount: number;
  /** Era groups of the selected local results (results page only). */
  groups: SearchGroup[];
}

export interface SmartSearchOptions {
  /** Max local results to return (dropdown: 8, results page: 24). */
  localCap?: number;
  /** Max Wikipedia results to return (dropdown: 8, results page: 10). */
  wikiCap?: number;
  /** Max Wikipedia queries to run (dropdown: 1 for speed — raised to 2
   *  only for new-generation country searches; page: 3). */
  maxWikiQueries?: number;
  /** Build era groups for the results page. */
  includeGroups?: boolean;
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

async function fetchWikiPages(query: string): Promise<RawWikiPage[]> {
  const endpoint = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(
    query
  )}&limit=40`;
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
    thumbnail: thumbnailUrl,
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
    wikiCap = 8,
    maxWikiQueries = 1,
    includeGroups = false,
  } = opts;

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
    localCount: 0,
    wikiCount: 0,
    totalCount: 0,
    groups: [],
  };
  if (!query) return empty;

  // ---- Local search: score every profile, then diversity-select ----
  const allProfiles = getAllProfiles();
  const scored = allProfiles
    .map((p) => ({ profile: p, score: scoreLocalProfile(p, intent) }))
    .filter((s) => s.score >= 0)
    .sort((a, b) => b.score - a.score || a.profile.name.localeCompare(b.profile.name));
  const localTotal = scored.length;
  const selected = selectDiverse(scored, localCap, intent);
  const local = selected.map((s) => toLocalItem(s.profile));

  // ---- Wikipedia discovery with intent-derived queries ----
  let wikipedia: WikiSearchItem[] = [];
  // New-generation country searches get ONE extra Wikipedia query in the
  // dropdown: a single "<Demonym> actor" query has no post-2000 actors in
  // Wikipedia's top 40 for many countries, while "<Demonym> singer"
  // finds them (singers skew younger). The full results page already runs
  // all three queries, so this only raises the dropdown's effective cap
  // from 1 to 2 for this one intent (era "new" + pure country, no
  // profession, no person name) — every other intent keeps its existing
  // query count, and the era hard filter is untouched.
  const needsNewGenSecondQuery =
    intent.era === "new" && intent.kind === "country";
  const effectiveMaxWikiQueries = needsNewGenSecondQuery
    ? Math.max(maxWikiQueries, 2)
    : maxWikiQueries;
  const wikiQueries = intent.wikiQueries.slice(
    0,
    Math.max(0, effectiveMaxWikiQueries)
  );
  if (wikiQueries.length > 0) {
    const pagesPerQuery = await Promise.all(wikiQueries.map((q) => fetchWikiPages(q)));

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
    }
    const candidates: ScoredWiki[] = [];
    pagesPerQuery.forEach((pages, qi) => {
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
        // Country intents: the result's PRIMARY association must be that
        // country. Wikipedia's search matches article TEXT, so a query
        // like "Mexican actor" can return a British actor whose article
        // merely mentions Mexico, or "American and Mexican actor" (whose
        // primary association is American). The FIRST demonym mentioned
        // across title + description + excerpt decides: "Mexican-American
        // actor" is primarily Mexican and passes; "American and Mexican
        // actor" is primarily American and is rejected. A "born in
        // <country>" statement counts only when it precedes any other
        // country's demonym.
        if (intent.country && (intent.kind === "country" || intent.kind === "country+profession")) {
          const combined = `${page.title} ${page.description || ""} ${page.excerpt ? stripHtml(page.excerpt) : ""}`;
          const mentions = findDemonymMentions(combined);
          const bornInIdx = combined.toLowerCase().indexOf(`born in ${intent.country.toLowerCase()}`);
          const primaryIsOurs =
            mentions.length > 0
              ? mentions[0].country === intent.country ||
                (bornInIdx !== -1 && bornInIdx < mentions[0].index)
              : bornInIdx !== -1;
          if (!primaryIsOurs) return;
        }
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
        seenWikiNames.add(normName);
        // Base score: Wikipedia relevance order (first query wins ties).
        let score = 100 - qi * 5 - pi * 2;
        const { birthYear, deathYear } = years;
        score += Math.max(-25, Math.min(25, eraBonus(birthYear, deathYear !== null, intent.era)));
        // Profession-word bonus (e.g. description "Mexican actor" for an actors search).
        if (intent.professionWord) {
          const hay = `${page.title} ${page.description || ""}`.toLowerCase();
          const w = intent.professionWord.toLowerCase();
          if (hay.includes(w) || hay.includes(`${w}s`)) score += 10;
        }
        candidates.push({ page, score, birthYear, deathYear });
      });
    });

    candidates.sort((a, b) => b.score - a.score);

    // Broad queries: interleave birth decades for era diversity, then append
    // items without a parseable birth year in relevance order.
    let picked: ScoredWiki[];
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

    wikipedia = picked.map((c) => toWikiItem(c.page));
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

  return {
    query,
    intent,
    local,
    localTotal,
    wikipedia,
    localCount: local.length,
    wikiCount: wikipedia.length,
    totalCount: local.length + wikipedia.length,
    groups,
  };
}

/** Re-exported for callers that need the wiki era of an already-mapped item. */
export { wikiEraBucket };
