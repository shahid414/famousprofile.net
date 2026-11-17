import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "";
  const trimmed = title.trim();

  if (!trimmed) {
    return NextResponse.json(
      { error: "Article title parameter is required." },
      { status: 400 }
    );
  }

  const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    trimmed
  )}`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        "User-Agent": "ProfileBookApp/1.0 (https://profilebook.org; contact@profilebook.org)",
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Wikipedia article not found (${res.status})` },
        { status: res.status }
      );
    }

    const data = await res.json();

    const article = {
      title: data.title || trimmed,
      description: data.description || "Public figure biography",
      extract: data.extract || "No summary biography available for this article.",
      image: data.originalimage?.source || data.thumbnail?.source || null,
      pageUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(trimmed)}`,
      timestamp: data.timestamp || new Date().toISOString(),
      license: "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
      attribution: "Live biographical data provided by the English Wikipedia community under CC BY-SA 4.0.",
    };

    return NextResponse.json(
      { article },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("Wikipedia article fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Wikipedia article details." },
      { status: 500 }
    );
  }
}

