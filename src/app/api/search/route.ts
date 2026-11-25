import { NextRequest, NextResponse } from "next/server";
import { smartSearch } from "@/lib/smartSearch";

export const dynamic = "force-dynamic";

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

  // Smart search: intent-aware ranking + diversity + Wikipedia discovery.
  // Dropdown stays fast: one Wikipedia query, except new-generation
  // country searches, where the shared core runs a second targeted query
  // ("<Demonym> singer") in parallel — see smartSearch.ts.
  const result = await smartSearch(trimmed, {
    localCap: 8,
    wikiCap: 8,
    maxWikiQueries: 1,
  });

  return NextResponse.json(
    {
      query: result.query,
      localCount: result.localCount,
      wikiCount: result.wikiCount,
      totalCount: result.totalCount,
      local: result.local,
      wikipedia: result.wikipedia,
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
