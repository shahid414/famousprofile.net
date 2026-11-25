import { NextRequest, NextResponse } from "next/server";
import { smartSearch } from "@/lib/smartSearch";

export const dynamic = "force-dynamic";

const DEEP_WIKI_CAP = 300;
const DEEP_LOCAL_CAP = 24;
const DEEP_DEFAULT_LIMIT = 30;
const DEEP_MAX_LIMIT = 50;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const trimmed = q.trim();

  if (!trimmed || trimmed.length < 1) {
    return NextResponse.json({
      query: trimmed,
      local: [],
      wikipedia: [],
      totalCount: 0,
    });
  }

  const includeGroups = searchParams.get("groups") === "1";
  const deep = searchParams.get("deep") === "1";

  if (!deep) {
    // Light mode — unchanged: fast dropdown path. Smart search with
    // intent-aware ranking + diversity + Wikipedia discovery. One
    // Wikipedia query, except new-generation country searches, where the
    // shared core runs a second targeted query ("<Demonym> singer") in
    // parallel — see smartSearch.ts. The homepage live search opts in
    // with ?groups=1 for era grouping.
    const result = await smartSearch(trimmed, {
      localCap: 8,
      wikiCap: 8,
      maxWikiQueries: 1,
      includeGroups,
    });

    return NextResponse.json(
      {
        query: result.query,
        localCount: result.localCount,
        wikiCount: result.wikiCount,
        totalCount: result.totalCount,
        local: result.local,
        wikipedia: result.wikipedia,
        // Era groups + local total, only when the caller opts in (?groups=1).
        ...(includeGroups
          ? { groups: result.groups, localTotal: result.localTotal }
          : {}),
        // Extra context for future UI use; SearchBar ignores unknown fields.
        intent: {
          kind: result.intent.kind,
          country: result.intent.country,
          profession: result.intent.profession,
          era: result.intent.era,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  }

  // Deep mode — the full discovery pool (multi-profession Wikipedia
  // queries, cached server-side for 10 minutes), sliced by offset/limit
  // for pagination. The pool is stable within the cache window, so pages
  // never duplicate or reshuffle. Local results are sent only with the
  // first page (offset 0); later pages carry Wikipedia results only.
  const offset = Math.max(
    0,
    parseInt(searchParams.get("offset") || "0", 10) || 0
  );
  const limit = Math.min(
    DEEP_MAX_LIMIT,
    Math.max(
      1,
      parseInt(searchParams.get("limit") || String(DEEP_DEFAULT_LIMIT), 10) ||
        DEEP_DEFAULT_LIMIT
    )
  );
  // The homepage box asks for fewer locals (12) than the results page
  // (24); the cache key includes localCap, so each caller keeps its own
  // stable pool.
  const localCap = Math.min(
    DEEP_LOCAL_CAP,
    Math.max(
      1,
      parseInt(searchParams.get("localCap") || String(DEEP_LOCAL_CAP), 10) ||
        DEEP_LOCAL_CAP
    )
  );
  const result = await smartSearch(trimmed, {
    localCap,
    wikiCap: DEEP_WIKI_CAP,
    deep: true,
    // Always true in deep mode so the cache key is identical for the
    // results page, the homepage box, and every Load More call.
    includeGroups: true,
  });
  const wikiSlice = result.wikipedia.slice(offset, offset + limit);
  const hasMore = offset + wikiSlice.length < result.wikiTotal;
  return NextResponse.json(
    {
      query: result.query,
      // Discovered totals (before pagination slicing).
      localTotal: result.localTotal,
      wikiTotal: result.wikiTotal,
      totalCount: result.localTotal + result.wikiTotal,
      // This page.
      local: offset === 0 ? result.local : [],
      localCount: offset === 0 ? result.localCount : 0,
      wikipedia: wikiSlice,
      wikiCount: wikiSlice.length,
      shownCount: (offset === 0 ? result.localCount : 0) + wikiSlice.length,
      offset,
      limit,
      hasMore,
      groups: result.groups,
      ...(result.stats ? { stats: result.stats } : {}),
      intent: {
        kind: result.intent.kind,
        country: result.intent.country,
        profession: result.intent.profession,
        era: result.intent.era,
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}
