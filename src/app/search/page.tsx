import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllProfiles } from "@/lib/data";
import { smartSearch } from "@/lib/smartSearch";
import { ERA_LABELS } from "@/lib/searchIntent";
import ProfileCard from "@/components/ProfileCard";
import SearchBar from "@/components/SearchBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import WikiResultCard from "@/components/WikiResultCard";
import SearchLoadMore from "@/components/SearchLoadMore";
import {
  Search,
  Globe,
  ShieldCheck,
  Sparkles,
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

async function DualSearchResults({ query }: { query: string }) {
  const allProfiles = getAllProfiles();
  const trimmed = query.trim();

  // Smart search (shared with /api/search): intent parsing, ranked +
  // diverse local selection, and DEEP Wikipedia discovery — one query per
  // profession in parallel (see wikiDiscovery.ts), up to 300 Wikipedia
  // results in the pool. Only the first batch renders now; SearchLoadMore
  // fetches the rest page by page from /api/search?deep=1.
  const result = trimmed
    ? await smartSearch(trimmed, {
        localCap: 24,
        wikiCap: 300,
        deep: true,
        includeGroups: true,
      })
    : null;

  const localResults = result?.local || [];
  const localTotal = result?.localTotal || 0;
  // The full deep pool (up to 300 Wikipedia results); only the first
  // batch renders now — the rest arrives via Load More.
  const wikiPool = result?.wikipedia || [];
  const wikiTotal = result?.wikiTotal || 0;
  const WIKI_INITIAL = 30;
  const wikiResults = wikiPool.slice(0, WIKI_INITIAL);
  const discoveredTotal = localTotal + wikiTotal;
  const shownTotal = localResults.length + wikiResults.length;
  const intent = result?.intent;
  const groups = result?.groups || [];
  const showGroups = groups.length > 1;

  // ProfileCard needs full Profile objects; resolve the API-shaped
  // local items back to the dataset records by slug.
  const profileBySlug = new Map(allProfiles.map((p) => [p.slug, p]));
  const toFullProfile = (item: { slug: string }) => profileBySlug.get(item.slug)!;

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
            Discovered {discoveredTotal} figures ({localTotal} in website directory • {wikiTotal} via live Wikipedia feed) — showing {shownTotal}
          </p>
          {intent && intent.kind !== "person" && (
            <p className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                Interpreted as:
              </span>
              {intent.country && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {intent.country}
                </span>
              )}
              {intent.profession && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                  {intent.profession}
                </span>
              )}
              {intent.era && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                  {ERA_LABELS[intent.era]}
                </span>
              )}
            </p>
          )}
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
      {discoveredTotal === 0 && (
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
                Website Directory Profiles ({localTotal})
              </h3>
            </div>
            {localTotal > localResults.length && (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Showing {localResults.length} of {localTotal} — most relevant &amp; diverse first
              </span>
            )}
          </div>

          {showGroups ? (
            <div className="space-y-8">
              {groups.map((group) => (
                <div key={group.key} className="space-y-4">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {group.title} ({group.items.length})
                    </h4>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {group.note}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.items.map((profile) => (
                      <ProfileCard key={profile.slug} profile={toFullProfile(profile)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localResults.map((profile) => (
                <ProfileCard key={profile.slug} profile={toFullProfile(profile)} />
              ))}
            </div>
          )}
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
                  : `Personality Profiles for "${query}"`} ({wikiTotal})
              </h3>
            </div>

            <span className="text-xs text-slate-400 dark:text-slate-500">
              ProfileBook Global Archive • Live On-Demand
              {wikiTotal > wikiResults.length &&
                ` — showing ${wikiResults.length} of ${wikiTotal}`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {wikiResults.map((item) => (
              <WikiResultCard key={item.id} item={item} />
            ))}
          </div>

          <SearchLoadMore
            query={query}
            initialOffset={wikiResults.length}
            wikiTotal={wikiTotal}
            initialIds={wikiResults.map((w) => w.id)}
          />
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
