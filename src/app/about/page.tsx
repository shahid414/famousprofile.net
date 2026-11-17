import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchBar from "@/components/SearchBar";
import { BookOpen, ShieldCheck, Database, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - ProfileBook Biographical Directory",
  description: "Learn about the ProfileBook mission to build an accessible, accurate, and completely transparent encyclopedia of world-renowned figures.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <Breadcrumbs items={[{ label: "About" }]} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-12 shadow-sm space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About ProfileBook
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>ProfileBook</strong> is a clean, static, and transparent global directory dedicated to preserving and celebrating the life trajectories, foundational works, and verified achievements of notable personalities worldwide.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Public Verification</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every profile record includes explicit citations to public registers, encyclopedia entries, or official records.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Static & Open Architecture</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Built with Next.js App Router and JSON storage, enabling zero-database privacy, rapid edge speeds, and simple community contributions.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Unbiased Legacies</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Focused on factual milestones, awards, notable works, and objective chronologies across living and historical personalities.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Our Editorial Standards
          </h2>
          <p>
            ProfileBook operates under strict standards of factual neutrality. We compile entries exclusively from public records, verified biographical databases, government registries, and peer-reviewed historical publications.
          </p>
          <p>
            If you notice any biographical inaccuracy or wish to request an update or profile removal, please visit our{" "}
            <a href="/contact" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Contact & Corrections page
            </a>.
          </p>
        </div>
      </div>

      {/* Search Directory or Wikipedia */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
        <div className="space-y-1 text-center max-w-lg mx-auto">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Search Personalities in ProfileBook &amp; Wikipedia
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Instant dual lookup across our verified local directory and the full English Wikipedia encyclopedia.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <SearchBar
            placeholder="Search personalities (e.g. Leonardo da Vinci, Marie Curie, Messi)..."
            size="large"
          />
        </div>
      </div>
    </div>
  );
}

