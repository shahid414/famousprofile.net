import { NextRequest, NextResponse } from "next/server";
import { smartSearch } from "@/lib/smartSearch";

export const dynamic = "force-dynamic";

// Live Wikipedia search — now powered by the same smart-search core as
// /api/search (intent parsing, era filtering, profession/country
// matching, Wikipedia discovery with full-directory dedup). Previously
// this route ran a raw Wikipedia query with no intent handling, which is
// why broad queries ("New Famous People from Mexico") returned
// historical figures instead of new-generation people.
//
// Response keeps the legacy shape ({query, count, results}) so existing
// callers keep working, and adds the canonical local matches + intent.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const trimmed = q.trim();

  // Input validation
  if (!trimmed || trimmed.length < 1) {
    return NextResponse.json(
      { error: "Search query cannot be empty.", results: [] },
      { status: 400 }
    );
  }

  try {
    const result = await smartSearch(trimmed, {
      localCap: 8,
      wikiCap: 10,
      maxWikiQueries: 3,
    });

    // Legacy wiki-only shape: Wikipedia discovery items as `results`.
    const results = result.wikipedia.map((w) => ({
      id: w.id,
      key: w.key,
      title: w.name,
      description: w.description,
      excerpt: w.excerpt,
      thumbnail: w.thumbnail,
    }));

    return NextResponse.json(
      {
        query: result.query,
        count: results.length,
        results,
        // Canonical directory matches (a person with a local profile never
        // appears again in `results` — the local profile is the one to use).
        local: result.local,
        localCount: result.localCount,
        totalCount: result.totalCount,
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
  } catch (error: any) {
    console.error("Wikipedia live search API error:", error);
    return NextResponse.json(
      { error: "Failed to connect to Wikipedia API. Please try again.", results: [] },
      { status: 500 }
    );
  }
}
