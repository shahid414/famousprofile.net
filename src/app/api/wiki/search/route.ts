import { NextRequest, NextResponse } from "next/server";
import { isFamousPersonality } from "@/lib/wikiFilter";

export const dynamic = "force-dynamic";

interface WikiThumbnail {
  url?: string;
  width?: number;
  height?: number;
}

interface WikiSearchPage {
  id: number;
  key: string;
  title: string;
  excerpt?: string;
  description?: string;
  thumbnail?: WikiThumbnail;
}

// Helper to strip HTML tags safely for secure display
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, "").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&");
}

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

  const endpoint = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(
    trimmed
  )}&limit=40`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        "User-Agent": "ProfileBookApp/1.0 (https://profilebook.org; contact@profilebook.org)",
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Wikipedia API returned status ${res.status}`, results: [] },
        { status: res.status }
      );
    }

    const data = await res.json();
    const pages: WikiSearchPage[] = data.pages || [];

    // Filter strictly for famous human personalities
    const results = pages
      .filter((page) =>
        isFamousPersonality({
          title: page.title,
          description: page.description,
          excerpt: page.excerpt,
        })
      )
      .slice(0, 10)
      .map((page) => {
      let thumbnailUrl: string | null = null;
      if (page.thumbnail && page.thumbnail.url) {
        thumbnailUrl = page.thumbnail.url.startsWith("//")
          ? `https:${page.thumbnail.url}`
          : page.thumbnail.url;
      }

      return {
        id: page.id,
        key: page.key,
        title: page.title,
        description: page.description || "Public figure / Wikipedia entry",
        excerpt: page.excerpt ? stripHtml(page.excerpt) : "",
        thumbnail: thumbnailUrl,
      };
    });

    return NextResponse.json(
      {
        query: trimmed,
        count: results.length,
        results,
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

