import Link from "next/link";
import type { Metadata } from "next";
import { getAllProfiles, getAllCategories } from "@/lib/data";
import ProfileCard from "@/components/ProfileCard";
import SearchBar from "@/components/SearchBar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Users, Sparkles, Filter, Layers, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Famous Personalities Directory - Biographies & Facts",
  description:
    "Explore the comprehensive directory of famous people, world leaders, iconic athletes, Nobel laureates, scientists, and creators documented on ProfileBook.",
  alternates: {
    canonical: "https://profilebook.org/people",
  },
  openGraph: {
    title: "Famous Personalities Directory | ProfileBook",
    description:
      "Explore curated profiles, biographies, and career highlights of iconic figures worldwide.",
    url: "https://profilebook.org/people",
  },
};

interface Props {
  searchParams: {
    letter?: string;
    cat?: string;
    page?: string;
  };
}

export default function PeopleDirectoryPage({ searchParams }: Props) {
  const allProfiles = getAllProfiles();
  const categories = getAllCategories();

  const selectedLetter = searchParams.letter?.toUpperCase() || "ALL";
  const selectedCategory = searchParams.cat || "ALL";
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const pageSize = 24;

  // Filter profiles by letter and category
  const filteredProfiles = allProfiles.filter((p) => {
    if (selectedLetter !== "ALL") {
      const firstChar = p.name.trim().charAt(0).toUpperCase();
      if (firstChar !== selectedLetter) return false;
    }
    if (selectedCategory !== "ALL") {
      if (p.category !== selectedCategory) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredProfiles.length / pageSize) || 1;
  const validPage = Math.min(currentPage, totalPages);
  const paginatedProfiles = filteredProfiles.slice(
    (validPage - 1) * pageSize,
    validPage * pageSize
  );

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Helper to preserve filters in pagination links
  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (selectedLetter !== "ALL") params.set("letter", selectedLetter);
    if (selectedCategory !== "ALL") params.set("cat", selectedCategory);
    if (pageNumber > 1) params.set("page", pageNumber.toString());
    const qs = params.toString();
    return `/people${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: "Famous Personalities" }]} />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
          <Users className="w-4 h-4" />
          <span>Biographical Index</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Famous Personalities &amp; World Figures
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Browse our comprehensive, curated encyclopedia of notable figures from sports, arts, science, and public leadership. Every profile features verified milestones, factual career timelines, awards, and primary citations.
        </p>

        {/* Global Dual Search Bar */}
        <div className="pt-2 max-w-2xl">
          <SearchBar
            placeholder="Search any personality on our site or Wikipedia (e.g. Messi, Einstein, Marie Curie)..."
            size="large"
          />
        </div>
      </div>

      {/* Filter Toolbar: Alphabet & Category Pills */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        {/* A-Z Letter Selector */}
        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Filter by Name (A–Z)
          </span>
          <div className="flex flex-wrap gap-1.5">
            <Link
              href={`/people?letter=ALL${selectedCategory !== "ALL" ? `&cat=${selectedCategory}` : ""}`}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${
                selectedLetter === "ALL"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All
            </Link>
            {alphabet.map((letter) => (
              <Link
                key={letter}
                href={`/people?letter=${letter}${selectedCategory !== "ALL" ? `&cat=${selectedCategory}` : ""}`}
                className={`w-7 h-7 flex items-center justify-center text-xs rounded-lg font-semibold transition ${
                  selectedLetter === letter
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {letter}
              </Link>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Filter by Domain &amp; Industry
          </span>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/people?letter=${selectedLetter}`}
              className={`px-3 py-1 text-xs rounded-xl font-medium transition ${
                selectedCategory === "ALL"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All Domains ({allProfiles.length})
            </Link>
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.slug}
                href={`/people?letter=${selectedLetter}&cat=${cat.slug}`}
                className={`px-3 py-1 text-xs rounded-xl font-medium transition ${
                  selectedCategory === cat.slug
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Results Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing <strong className="text-slate-900 dark:text-white">{paginatedProfiles.length}</strong> of {filteredProfiles.length} personalities
          {totalPages > 1 && ` (Page ${validPage} of ${totalPages})`}
        </span>
        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
          Permanent SEO URLs with verified citations
        </span>
      </div>

      {/* Profiles Grid */}
      {paginatedProfiles.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginatedProfiles.map((p) => (
              <ProfileCard key={p.slug} profile={p} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Link
                href={getPageUrl(Math.max(1, validPage - 1))}
                aria-disabled={validPage === 1}
                className={`px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold transition ${
                  validPage === 1
                    ? "opacity-40 pointer-events-none text-slate-400"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                &larr; Previous
              </Link>

              <span className="text-xs text-slate-600 dark:text-slate-400 px-3 font-medium">
                Page {validPage} of {totalPages}
              </span>

              <Link
                href={getPageUrl(Math.min(totalPages, validPage + 1))}
                aria-disabled={validPage === totalPages}
                className={`px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold transition ${
                  validPage === totalPages
                    ? "opacity-40 pointer-events-none text-slate-400"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Next &rarr;
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-3">
          <p className="text-slate-700 dark:text-slate-300 font-bold">
            No personalities match your active filter.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You can search any global figure via the search bar above to fetch an on-demand profile from Wikipedia.
          </p>
          <Link
            href="/people"
            className="inline-block mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
          >
            Clear Filters
          </Link>
        </div>
      )}
    </div>
  );
}
