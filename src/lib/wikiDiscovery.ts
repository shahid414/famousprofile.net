/**
 * Wikipedia discovery query builder for deep search.
 *
 * The old pipeline ran at most 3 Wikipedia queries for a country search
 * ("<Demonym> actor", "<Demonym> singer", "<Demonym> scientist") with a
 * 40-result fetch limit and a 10-result cap — so "Old Famous People from
 * Pakistan" could only ever return actors/singers/scientists, and the era
 * filter then kept just 2 of them. The real historical Pakistanis
 * (politicians, poets, writers, generals) were never even queried.
 *
 * Deep discovery instead runs one "<Demonym> <profession>" query per
 * profession in parallel, so every profession contributes candidates and
 * the era/profession filters — not the query set — decide what survives.
 * All queries are intent-derived (no hardcoded person lists); relevance
 * filtering still happens in smartSearch.ts.
 */

import type { SearchIntent } from "./searchIntent";

/** Professions queried for a pure-country deep search, in priority order. */
const DEEP_COUNTRY_PROFESSIONS = [
  "actor",
  "singer",
  "politician",
  "cricketer",
  "footballer",
  "scientist",
  "writer",
  "poet",
  "artist",
  "athlete",
  "doctor",
  "journalist",
  "businessman",
  "scholar",
];

/** Deep order for historical searches: the history-shaping professions
 *  first, so their results are not crowded out by entertainers. */
const HISTORICAL_ORDER = [
  "politician",
  "writer",
  "poet",
  "scientist",
  "scholar",
  "artist",
  "general",
  "freedom fighter",
  "actor",
  "singer",
  "cricketer",
  "footballer",
  "athlete",
  "doctor",
  "journalist",
  "businessman",
];

/** Deep order for new-generation searches: the professions where young
 *  famous people actually appear, first. */
const NEW_ORDER = [
  "actor",
  "singer",
  "cricketer",
  "footballer",
  "athlete",
  "politician",
  "scientist",
  "writer",
  "poet",
  "artist",
  "doctor",
  "journalist",
  "businessman",
  "scholar",
];

export function buildDiscoveryQueries(
  intent: SearchIntent,
  mode: "light" | "deep"
): string[] {
  const demonym = intent.demonym;
  const kind = intent.kind;

  if (kind === "person") {
    // A named person: the raw query is the only sensible Wikipedia query.
    return [intent.rawQuery];
  }

  if (kind === "country+profession" && demonym && intent.professionWord) {
    const main = `${demonym} ${intent.professionWord}`;
    if (mode === "light") {
      const queries = [main];
      if (intent.profession === "athletes") queries.push(`${demonym} boxer`);
      return queries;
    }
    // Deep: the main profession query plus a natural-language variant
    // ("Famous actors from Pakistan") which surfaces a different slice
    // of Wikipedia's relevance ranking, plus the boxer extra for athletes.
    const plural = `${intent.professionWord}s`;
    const queries = [main, `Famous ${plural} from ${intent.country}`];
    if (intent.profession === "athletes") queries.push(`${demonym} boxer`);
    return queries;
  }

  if ((kind === "country" || kind === "era") && demonym) {
    if (mode === "light") {
      // Unchanged: the fast dropdown path keeps the original 3 queries.
      return [`${demonym} actor`, `${demonym} singer`, `${demonym} scientist`];
    }
    // Deep: one query per profession, ordered by era so the most
    // relevant professions for the intent are queried first.
    const order =
      intent.era === "historical"
        ? HISTORICAL_ORDER
        : intent.era === "new"
          ? NEW_ORDER
          : DEEP_COUNTRY_PROFESSIONS;
    const seen = new Set<string>();
    const queries: string[] = [];
    for (const profession of order) {
      const q = `${demonym} ${profession}`;
      if (!seen.has(q)) {
        seen.add(q);
        queries.push(q);
      }
    }
    return queries;
  }

  // Profession-only and era-only: no Wikipedia query — the local dataset
  // covers them, and Wikipedia's search API has no useful profession-only
  // or era-only person query (bare profession words return topic articles).
  return [];
}
