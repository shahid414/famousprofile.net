/**
 * Intent-aware relevance scoring + diversity selection for ProfileBook search.
 *
 * Rules (all grounded in verified data only):
 * - Birth/death years come ONLY from the profile's own birthDate/deathDate
 *   (or from the Wikipedia description/excerpt text for wiki items).
 *   Never invented, never guessed.
 * - No popularity scores, no "Trending" labels: recognizability is NOT
 *   scored because we have no reliable popularity source.
 * - Era is a ranking bias, not a hard filter (except where the intent
 *   explicitly asks for historical/modern — even then a strong name or
 *   country+profession match is not discarded, it is only down-ranked).
 */

import type { Profile } from "@/types";
import type { SearchIntent } from "./searchIntent";
import {
  NEW_GENERATION_MIN_BIRTH_YEAR,
  MODERN_MIN_BIRTH_YEAR,
  HISTORICAL_MAX_BIRTH_YEAR,
} from "./searchIntent";

/** Extract the birth year from a "YYYY-MM-DD" (or BCE "-YYYY-MM-DD") date. */
export function birthYearOf(profile: Profile): number | null {
  const raw = (profile.birthDate || "").trim();
  const m = raw.match(/^(-?\d{1,4})-\d{2}-\d{2}$/);
  if (!m) return null;
  const year = parseInt(m[1], 10);
  return Number.isFinite(year) ? year : null;
}

export function deathYearOf(profile: Profile): number | null {
  const raw = (profile.deathDate || "").trim();
  if (!raw) return null;
  const m = raw.match(/^(-?\d{1,4})-\d{2}-\d{2}$/);
  if (!m) return null;
  const year = parseInt(m[1], 10);
  return Number.isFinite(year) ? year : null;
}

export type EraBucket = "new" | "modern" | "established" | "historical";

/**
 * Era bucket from verified dates only. The four buckets are mutually
 * exclusive and use the shared thresholds from searchIntent.ts:
 * new = born >= 2000 and living; modern = born >= 1990 and living;
 * historical = deceased or born < 1950; everything else = established.
 */
export function eraBucketOf(profile: Profile): EraBucket {
  const birth = birthYearOf(profile);
  const died = deathYearOf(profile);
  if (birth !== null && birth >= NEW_GENERATION_MIN_BIRTH_YEAR && !died) return "new";
  if (birth !== null && birth >= MODERN_MIN_BIRTH_YEAR && !died) return "modern";
  if (died !== null || (birth !== null && birth < HISTORICAL_MAX_BIRTH_YEAR)) return "historical";
  return "established";
}

export const ERA_GROUP_TITLES: Record<EraBucket, string> = {
  new: "New Generation",
  modern: "Modern Personalities",
  established: "Established Figures",
  historical: "Historical Figures",
};

export const ERA_GROUP_NOTES: Record<EraBucket, string> = {
  new: "Born 2000 or later",
  modern: "Born 1990 – 1999",
  established: "Born 1950 – 1989",
  historical: "Born before 1950 or deceased",
};

/**
 * Hard era compatibility, from verified dates only. Used as a FILTER
 * (not just a ranking bias) for era intents: a profile that fails this
 * must never appear in that era's result set. Unknown birth year =
 * not compatible (its era cannot be verified — never guessed).
 */
export function eraCompatible(
  profile: Profile,
  era: "new" | "modern" | "historical" | null
): boolean {
  if (!era) return true;
  const birth = birthYearOf(profile);
  const died = deathYearOf(profile) !== null;
  if (era === "new") return birth !== null && birth >= NEW_GENERATION_MIN_BIRTH_YEAR && !died;
  if (era === "modern") return birth !== null && birth >= MODERN_MIN_BIRTH_YEAR && !died;
  return died || (birth !== null && birth < HISTORICAL_MAX_BIRTH_YEAR);
}

/** Same rule for Wikipedia items, from years parsed out of their text. */
export function wikiEraCompatible(
  birthYear: number | null,
  died: boolean,
  era: "new" | "modern" | "historical" | null
): boolean {
  if (!era) return true;
  if (era === "new") return birthYear !== null && birthYear >= NEW_GENERATION_MIN_BIRTH_YEAR && !died;
  if (era === "modern") return birthYear !== null && birthYear >= MODERN_MIN_BIRTH_YEAR && !died;
  return died || (birthYear !== null && birthYear < HISTORICAL_MAX_BIRTH_YEAR);
}

/** Decade bucket for diversity round-robin (e.g. 1990, 1980, ...). */
export function decadeOf(profile: Profile): number | null {
  const birth = birthYearOf(profile);
  if (birth === null) return null;
  return Math.floor(birth / 10) * 10;
}

/**
 * Era bias applied on top of a match score. Uses only verified dates and
 * the shared thresholds. "new" is the strictest tier: only post-2000
 * births score up; 1990s births get a small bonus, anything older is
 * pushed down hard.
 */
export function eraBonus(
  birthYear: number | null,
  died: boolean,
  era: "new" | "modern" | "historical" | null
): number {
  if (!era) return 0;
  if (era === "new") {
    let bonus = 0;
    if (birthYear !== null && birthYear >= NEW_GENERATION_MIN_BIRTH_YEAR) bonus += 40;
    else if (birthYear !== null && birthYear >= MODERN_MIN_BIRTH_YEAR) bonus += 12;
    if (!died) bonus += 8;
    if (died) bonus -= 30;
    if (birthYear !== null && birthYear < 1980) bonus -= 25;
    return bonus;
  }
  if (era === "modern") {
    let bonus = 0;
    if (birthYear !== null && birthYear >= MODERN_MIN_BIRTH_YEAR) bonus += 30;
    else if (birthYear !== null && birthYear >= 1980) bonus += 10;
    if (!died) bonus += 8;
    if (died) bonus -= 25;
    if (birthYear !== null && birthYear < 1960) bonus -= 15;
    return bonus;
  }
  // historical
  let bonus = 0;
  if (died) bonus += 25;
  if (birthYear !== null && birthYear < HISTORICAL_MAX_BIRTH_YEAR) bonus += 25;
  if (birthYear !== null && birthYear < 1900) bonus += 10;
  if (!died && birthYear !== null && birthYear >= 1980) bonus -= 25;
  if (!died && birthYear !== null && birthYear >= 1960) bonus -= 10;
  return bonus;
}

export interface ScoredProfile {
  profile: Profile;
  score: number;
}

const norm = (s: string | undefined | null): string => (s || "").toLowerCase();

/**
 * Score one local profile against the parsed intent.
 * Returns -1 when the profile does not satisfy the intent's hard filters
 * (country / profession must match for country/profession intents).
 */
export function scoreLocalProfile(profile: Profile, intent: SearchIntent): number {
  const birth = birthYearOf(profile);
  const died = deathYearOf(profile) !== null;

  if (intent.kind === "person") {
    const q = (intent.personQuery || "").toLowerCase().trim();
    if (!q) return -1;
    const name = norm(profile.name);
    const nickname = norm(profile.nickname);
    let score = 0;
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 85;
    else if (name.includes(q)) score = 65;
    else if (nickname && nickname.includes(q)) score = 55;
    else if (norm(profile.profession).includes(q)) score = 35;
    else if (norm(profile.industry).includes(q)) score = 25;
    else if (norm(profile.category).includes(q)) score = 20;
    else if (norm(profile.country).includes(q)) score = 15;
    else if (norm(profile.bio).includes(q)) score = 5;
    else return -1;
    // Multi-word person query: reward matching every token in the name.
    const tokens = q.split(/\s+/).filter(Boolean);
    if (tokens.length > 1) {
      const matchedTokens = tokens.filter((t) => name.includes(t)).length;
      score += matchedTokens * 5;
    }
    // Country/profession context (e.g. "Mexican Einstein") boosts same-country hits.
    if (intent.country && norm(profile.country) === intent.country.toLowerCase()) score += 10;
    if (intent.profession && norm(profile.category) === intent.profession.toLowerCase()) score += 10;
    if (score < 10) return -1; // bio-only matches are too weak for person search
    return score;
  }

  // Broad intents: hard filters first. Profession is decided by the
  // profile's category slug only — a director whose bio mentions acting
  // must NOT appear in an actors search.
  if (intent.country && norm(profile.country) !== intent.country.toLowerCase()) return -1;
  if (intent.profession && norm(profile.category) !== intent.profession.toLowerCase()) return -1;
  // Era intents are a HARD filter too: a profile that fails eraCompatible
  // must never appear in that era's result set (e.g. a 1966-born actor
  // must not appear in a "new generation" search, even if she is the
  // only local profile from that country). Person searches ignore era —
  // an exact name match always wins.
  if (intent.era && !eraCompatible(profile, intent.era)) return -1;

  let score = 40; // base: satisfied the hard filters
  if (intent.country) score += 20;
  if (intent.profession) score += 20;
  // A leftover person token (should not normally happen for broad kinds)
  // still boosts a name match.
  if (intent.personQuery && norm(profile.name).includes(intent.personQuery.toLowerCase())) {
    score += 30;
  }
  score += eraBonus(birth, died, intent.era);
  return score;
}

/**
 * Diversity-aware selection for broad queries.
 * Round-robin across birth decades (so one decade cannot dominate),
 * preferring a different profession inside each decade when possible.
 * Person queries keep pure score order.
 *
 * When an era is requested, era relevance beats decade diversity: take the
 * era-compatible items first (by score), and backfill with the rest only
 * if slots remain — a living 1991-born actor must not top a historical
 * search just because the 1990s bucket came up in the rotation.
 */
export function selectDiverse<T extends { profile: Profile }>(
  scored: T[],
  cap: number,
  intent: SearchIntent
): T[] {
  if (scored.length <= cap) return scored;
  if (intent.kind === "person") return scored.slice(0, cap);
  if (intent.era) {
    const compatible = scored.filter((s) => eraCompatible(s.profile, intent.era));
    const rest = scored.filter((s) => !eraCompatible(s.profile, intent.era));
    return [...compatible, ...rest].slice(0, cap);
  }

  // Group by decade, each group already in score order.
  const byDecade = new Map<number, T[]>();
  const unknown: T[] = [];
  for (const item of scored) {
    const d = decadeOf(item.profile);
    if (d === null) unknown.push(item);
    else {
      const list = byDecade.get(d) || [];
      list.push(item);
      byDecade.set(d, list);
    }
  }
  // Historical intent: oldest decades first; otherwise newest first.
  const decades = Array.from(byDecade.keys()).sort((a, b) =>
    intent.era === "historical" ? a - b : b - a
  );

  const picked: T[] = [];
  const usedCategories = new Set<string>();
  let round = 0;
  while (picked.length < cap) {
    let progressed = false;
    for (const d of decades) {
      if (picked.length >= cap) break;
      const bucket = byDecade.get(d)!;
      if (!bucket.length) continue;
      // Prefer a profile whose category hasn't been picked yet this round.
      let idx = bucket.findIndex(
        (it) => !usedCategories.has(norm(it.profile.category))
      );
      if (idx === -1) idx = 0;
      const [item] = bucket.splice(idx, 1);
      picked.push(item);
      usedCategories.add(norm(item.profile.category));
      progressed = true;
    }
    // Undated profiles go last.
    if (!progressed) {
      while (picked.length < cap && unknown.length) {
        picked.push(unknown.shift()!);
      }
      break;
    }
    round++;
    if (round > 30) break; // safety
    usedCategories.clear();
  }
  return picked;
}

/**
 * Parse a birth (and death) year from Wikipedia description/excerpt text.
 *
 * Person-context only: years are accepted ONLY from
 * "(born ...)" / "(Month D, YYYY – ...)" / "(YYYY–YYYY)" lead patterns or a
 * loose "born YYYY". Date prefixes accept both "14 May 1904" and
 * "May 14, 1904" spellings — the old pattern missed the US spelling
 * (e.g. Hans Albert Einstein "(May 14, 1904 – July 26, 1973)" parsed as
 * undated). A bare year range is never taken from a work title: the
 * lifespan pattern must appear within the first 120 characters (the lead
 * "Name (dates) was a ..."), so a TV show's run "(2002–2012)" buried
 * later in the text is never misread as a lifespan.
 */
export function parseWikiYears(item: {
  description?: string | null;
  excerpt?: string | null;
}): { birthYear: number | null; deathYear: number | null } {
  const text = `${item.description || ""} ${item.excerpt || ""}`;
  // Day-month OR month-day date prefix, e.g. "14 May 1904" / "May 14, 1904".
  const DATE_PREFIX = String.raw`(?:(?:\d{1,2}\s+[A-Za-z]+|[A-Za-z]+\s+\d{1,2},?)\s+)?`;
  // 1. "(born 1993)" / "(born 17 September 1993)" / "(born May 14, 1904)"
  //    — birth only. Must come FIRST: a bare year range later in the text
  //    may belong to something else entirely (e.g. a TV show's run).
  const bornParen = text.match(new RegExp(`\\(\\s*born\\s+${DATE_PREFIX}(\\d{4})\\s*\\)`, "i"));
  if (bornParen) {
    const birth = parseInt(bornParen[1], 10);
    if (birth >= 1500 && birth <= 2026) return { birthYear: birth, deathYear: null };
  }
  // 2. Lifespan range "(1915–1983)" / "(9 January 1987 – 15 September 2006)"
  //    / "(May 14, 1904 – July 26, 1973)". Only when it appears early in
  //    the text (the lead "Name (dates) was a ...").
  //    (2026-11-25 accuracy audit) A year range is NOT always a lifespan:
  //    for office-holders the description often holds a TERM, e.g.
  //    "Member of the National Assembly of Pakistan from Chitral
  //    (2024–2029)" — reading that as "born 2024" put five politicians
  //    with unknown birth years into New Generation results. Two guards:
  //    (a) a range ending in a FUTURE year can never be a lifespan
  //    (a dead person's death year is in the past; a living person's
  //    range is open-ended), so discard the whole range, not just the
  //    end year; (b) a range inside a description that names an office
  //    (member of / assembly / parliament / ...) is a term, not a life —
  //    fall through to the "born" checks instead.
  const lifespan = text.match(
    new RegExp(`\\(\\s*${DATE_PREFIX}(\\d{4})\\s*[–—-]\\s*${DATE_PREFIX}(\\d{4})?\\s*\\)`)
  );
  if (lifespan && lifespan.index !== undefined && lifespan.index < 120) {
    const birth = parseInt(lifespan[1], 10);
    const death = lifespan[2] ? parseInt(lifespan[2], 10) : null;
    const descLen = (item.description || "").length;
    const inDescription = lifespan.index < descLen;
    const isTermRange =
      inDescription &&
      /member of|assembly|parliament|senator|minister|mayor|governor|council|representative/i.test(
        item.description || ""
      );
    const futureEnd = death !== null && death > 2026;
    if (birth >= 1500 && birth <= 2026 && !isTermRange && !futureEnd) {
      return { birthYear: birth, deathYear: death && death >= 1500 && death <= 2026 ? death : null };
    }
  }
  // 3. Loose "born YYYY" anywhere.
  const bornLoose = text.match(new RegExp(`\\bborn\\s+${DATE_PREFIX}(\\d{4})\\b`, "i"));
  if (bornLoose) {
    const birth = parseInt(bornLoose[1], 10);
    if (birth >= 1500 && birth <= 2026) return { birthYear: birth, deathYear: null };
  }
  return { birthYear: null, deathYear: null };
}

/** Era bucket for a Wikipedia item, from parsed years only (null = unknown). */
export function wikiEraBucket(item: {
  description?: string | null;
  excerpt?: string | null;
}): EraBucket | null {
  const { birthYear, deathYear } = parseWikiYears(item);
  if (birthYear === null && deathYear === null) return null;
  if (birthYear !== null && birthYear >= NEW_GENERATION_MIN_BIRTH_YEAR && !deathYear) return "new";
  if (birthYear !== null && birthYear >= MODERN_MIN_BIRTH_YEAR && !deathYear) return "modern";
  if (deathYear !== null || (birthYear !== null && birthYear < HISTORICAL_MAX_BIRTH_YEAR)) return "historical";
  return "established";
}

/** Normalize a person name for dedup: lowercase, drop parentheticals/punctuation. */
export function normalizeName(name: string): string {
  return (name || "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Slug form of a Wikipedia key: "Ronaldo_(Brazilian_footballer)" -> "ronaldo-(brazilian-footballer)". */
export function wikiKeyToSlug(key: string): string {
  return key.toLowerCase().replace(/_/g, "-");
}
