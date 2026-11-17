import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllProfiles } from "@/lib/data";
import { isFamousPersonality } from "@/lib/wikiFilter";
import ProfileCard from "@/components/ProfileCard";
import SearchBar from "@/components/SearchBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Search,
  Globe,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dual Profile Search - Directory & Global Wikipedia",
  description:
    "Unified dual profile search across published directory personalities and millions of global figures on English Wikipedia.",
  robots: {
    index: false, // Prevent thin search result indexing
    follow: false,
  },
};

interface Props {
  searchParams: {
    q?: string;
  };
}

// Fetch live Wikipedia results on the server
async function fetchWikiSearch(query: string) {
  if (!query || query.trim().length < 1) return [];

  const endpoint = `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(
    query.trim()
  )}&limit=40`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        "User-Agent":
          "ProfileBookApp/1.0 (https://profilebook.org; contact@profilebook.org)",
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    const pages = data.pages || [];

    // Filter strictly for famous human personalities
    return pages
      .filter((page: any) =>
        isFamousPersonality({
          title: page.title,
          description: page.description,
          excerpt: page.excerpt,
        })
      )
      .slice(0, 10)
      .map((page: any) => {
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
        description: page.description || "Public figure on Wikipedia",
        excerpt: page.excerpt
          ? page.excerpt
              .replace(/<[^>]*>?/gm, "")
              .replace(/&quot;/g, '"')
              .replace(/&#039;/g, "'")
          : "",
        thumbnail: thumbnailUrl,
        url: `/people/${encodeURIComponent(page.key.toLowerCase().replace(/_/g, "-"))}`,
      };
    });
  } catch (e) {
    console.error("Wikipedia search fetch error on server:", e);
    return [];
  }
}

async function DualSearchResults({ query }: { query: string }) {
  const allProfiles = getAllProfiles();
  const trimmed = query.trim().toLowerCase();

  // 1. Search our website's own profile database
  const localResults = trimmed
    ? allProfiles.filter((p) => {
        return (
          p.name.toLowerCase().includes(trimmed) ||
          p.profession.toLowerCase().includes(trimmed) ||
          (p.industry && p.industry.toLowerCase().includes(trimmed)) ||
          (p.country && p.country.toLowerCase().includes(trimmed)) ||
          (p.nickname && p.nickname.toLowerCase().includes(trimmed)) ||
          p.category.toLowerCase().includes(trimmed) ||
          p.bio.toLowerCase().includes(trimmed)
        );
      })
    : [];

  const localNamesSet = new Set(
    localResults.map((p) => p.name.toLowerCase().trim())
  );

  // 2. Search Wikipedia API concurrently
  const rawWiki = trimmed ? await fetchWikiSearch(query) : [];

  // Deduplicate Wikipedia results that are already on our website
  const wikiResults = rawWiki.filter(
    (w: any) => !localNamesSet.has(w.title.toLowerCase().trim())
  );

  const totalCount = localResults.length + wikiResults.length;

  if (!trimmed) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Showing all {allProfiles.length} published directory profiles</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProfiles.slice(0, 15).map((profile) => (
            <ProfileCard key={profile.slug} profile={profile} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Search Header Result Count Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Results for &ldquo;<span className="text-indigo-600 dark:text-indigo-400">{query}</span>&rdquo;
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Found {totalCount} total figures ({localResults.length} in website directory • {wikiResults.length} via live Wikipedia feed)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {localResults.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{localResults.length} Verified Local</span>
            </span>
          )}
          {wikiResults.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>{wikiResults.length} Wikipedia</span>
            </span>
          )}
        </div>
      </div>

      {/* Zero Results State */}
      {totalCount === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-3">
          <Search className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No profiles found for &ldquo;{query}&rdquo;
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Neither our curated database nor the English Wikipedia REST API returned any matching biographies. Please verify the spelling or search by full name.
          </p>
        </div>
      )}

      {/* FEATURE 1: Website Directory Profiles (Top Priority) */}
      {localResults.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Published on Our Website (Priority 1)</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Website Directory Profiles ({localResults.length})
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localResults.map((profile) => (
              <ProfileCard key={profile.slug} profile={profile} />
            ))}
          </div>
        </section>
      )}

      {/* FEATURE 2: Wikipedia Profiles (Secondary / Supplementary) */}
      {wikiResults.length > 0 && (
        <section className={`space-y-6 ${localResults.length > 0 ? "pt-8 border-t border-slate-200 dark:border-slate-800" : ""}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Globe className="w-4 h-4" />
                <span>
                  {localResults.length > 0
                    ? "Additional Global Figures"
                    : "Global Personality Profiles"}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {localResults.length > 0
                  ? "Additional Global Figures"
                  : `Personality Profiles for "${query}"`} ({wikiResults.length})
              </h3>
            </div>

            <span className="text-xs text-slate-400 dark:text-slate-500">
              ProfileBook Global Archive • Live On-Demand
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {wikiResults.map((item: any) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        sizes="96px"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl">
                        <span>{item.title.substring(0, 2).toUpperCase()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 uppercase">
                        Wikipedia
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {item.title}
                    </h4>

                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 line-clamp-1">
                      {item.description}
                    </p>

                    {item.excerpt && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1">
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Attribution: CC BY-SA 4.0
                  </span>

                  <Link
                    href={item.url}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || "";

  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "Search" }]} />

      {/* Unified Search Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm space-y-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Dual Profile Search: Local Directory + Global Wikipedia</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Search Personalities
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            Searches our verified profile database first. If not found or for more entries, automatically connects to English Wikipedia in real-time.
          </p>
        </div>

        <div className="pt-2 max-w-2xl">
          <SearchBar
            initialQuery={query}
            size="large"
            placeholder="Type any personality (e.g. Messi, Einstein, Newton, Michael Jackson)..."
          />
        </div>
      </div>

      {/* Results View */}
      <Suspense
        key={query}
        fallback={
          <div className="text-center py-16 space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-medium">
              Searching website directory and Wikipedia API concurrently...
            </p>
          </div>
        }
      >
        <DualSearchResults query={query} />
      </Suspense>
    </div>
  );
}
