import { NextRequest, NextResponse } from "next/server";
import { getAllProfiles } from "@/lib/data";
import { isFamousPersonality } from "@/lib/wikiFilter";

export const dynamic = "force-dynamic";

interface SearchIndexItem {
  slug: string;
  name: string;
  category: string;
  profession: string;
  country: string;
  industry?: string;
  image: string;
  imageCredit: string;
  bio: string;
  searchIndex: string;
}

let cachedIndex: SearchIndexItem[] | null = null;
let lastIndexUpdate = 0;
const IS_PROD = process.env.NODE_ENV === "production";
const INDEX_TTL_MS = IS_PROD ? 10 * 60 * 1000 : 30 * 1000;

function getSearchIndex(): SearchIndexItem[] {
  const now = Date.now();
  if (cachedIndex && now - lastIndexUpdate < INDEX_TTL_MS) {
    return cachedIndex;
  }

  const profiles = getAllProfiles();
  cachedIndex = profiles.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    profession: p.profession,
    country: p.country,
    industry: p.industry,
    image: p.image,
    imageCredit: p.imageCredit,
    bio: p.bio,
    searchIndex: `${p.name} ${p.profession} ${p.industry || ""} ${p.country || ""} ${p.nickname || ""} ${p.category}`.toLowerCase(),
  }));
  lastIndexUpdate = now;
  return cachedIndex;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&");
}

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

  const queryLower = trimmed.toLowerCase();

  // FEATURE 1: Search Website's Own Published Profiles First
  const localIndex = getSearchIndex();
  const matchedLocal = localIndex
    .filter((p) => p.searchIndex.includes(queryLower))
    .slice(0, 8)
    .map((p) => ({
      type: "local" as const,
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
    }));

  const localNamesSet = new Set(
    matchedLocal.map((item) => item.name.toLowerCase().trim())
  );

  // FEATURE 2: Live Wikipedia Search (Official MediaWiki REST API)
  let wikiResults: any[] = [];
  try {
    const wikiEndpoint = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(
      trimmed
    )}&limit=40`;

    const wikiRes = await fetch(wikiEndpoint, {
      headers: {
        "User-Agent":
          "ProfileBookApp/1.0 (https://profilebook.org; contact@profilebook.org)",
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });

    if (wikiRes.ok) {
      const data = await wikiRes.json();
      const pages: any[] = data.pages || [];

      // Filter strictly for famous human personalities and exclude local duplicates
      wikiResults = pages
        .filter(
          (page) =>
            !localNamesSet.has(page.title.toLowerCase().trim()) &&
            isFamousPersonality({
              title: page.title,
              description: page.description,
              excerpt: page.excerpt,
            })
        )
        .slice(0, 8)
        .map((page) => {
          let thumbnailUrl: string | null = null;
          if (page.thumbnail && page.thumbnail.url) {
            thumbnailUrl = page.thumbnail.url.startsWith("//")
              ? `https:${page.thumbnail.url}`
              : page.thumbnail.url;
          }

          return {
            type: "wikipedia" as const,
            id: page.id,
            key: page.key,
            name: page.title,
            description: page.description || "Public Figure (Wikipedia)",
            excerpt: page.excerpt ? stripHtml(page.excerpt) : "",
            thumbnail: thumbnailUrl,
            url: `/people/${encodeURIComponent(page.key.toLowerCase().replace(/_/g, "-"))}`,
          };
        });
    }
  } catch (err) {
    console.warn("Wikipedia live search fetch error in dual search:", err);
    // Graceful fallback - keep local results even if Wikipedia fails
  }

  return NextResponse.json(
    {
      query: trimmed,
      localCount: matchedLocal.length,
      wikiCount: wikiResults.length,
      totalCount: matchedLocal.length + wikiResults.length,
      local: matchedLocal,
      wikipedia: wikiResults,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    }
  );
}
