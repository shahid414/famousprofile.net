import Link from "next/link";
import type { Metadata } from "next";
import { getAllCountries } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchBar from "@/components/SearchBar";
import { Globe, Users, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Browse by Country - Personalities Worldwide",
  description: "Explore famous people, world leaders, athletes, and pioneers organized by their country of origin.",
};

export default function CountriesIndexPage() {
  const countries = getAllCountries();

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Countries" }]} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
          <Globe className="w-4 h-4" />
          <span>Geographical Index</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Browse Personalities by Country
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
          Discover influential icons, innovators, and world-changers categorized by their country of origin.
        </p>
      </div>

      {/* Countries Dual Search Bar */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Search Personalities Across Any Nation or Live Wikipedia
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hidden sm:inline">
            Direct &amp; Live Wiki Dual Search
          </span>
        </div>
        <SearchBar
          placeholder="Search personalities by country or name (e.g. Messi, Marie Curie, Nelson Mandela)..."
          size="large"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {countries.map((c) => (
          <Link
            key={c.slug}
            href={`/countries/${c.slug}`}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 hover:shadow-md transition flex items-center justify-between group"
          >
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {c.country}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {c.count} {c.count === 1 ? "Profile" : "Profiles"}
              </p>
            </div>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium group-hover:translate-x-1 transition-transform">
              &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

