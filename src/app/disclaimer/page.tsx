import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchBar from "@/components/SearchBar";
import { AlertTriangle, ShieldCheck, Mail, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer & Corrections Policy - ProfileBook",
  description: "Legal disclaimer regarding public information compilation, copyright, error corrections, and profile removals.",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: "Disclaimer" }]} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-12 shadow-sm space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4" />
          <span>Legal & Editorial Notice</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Disclaimer & Corrections Policy
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last updated: October 2026
        </p>

        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              1. Compilation from Public Sources
            </h2>
            <p>
              Information published on <strong>ProfileBook</strong> is compiled solely from publicly accessible sources, open encyclopedias (such as Wikipedia), verified news reporting, official biographies, sports registries, and academic archives. While we make every good-faith effort to ensure completeness and accuracy, biographical data may contain inadvertent errors, omissions, or outdated figures.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. No Warranty & Informational Purpose
            </h2>
            <p>
              All content on ProfileBook is provided on an &ldquo;as is&rdquo; basis for informational, educational, and historical reference only. ProfileBook makes no warranties, express or implied, regarding the commercial fitness, legal validity, or absolute accuracy of any information presented.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Requesting Fact Corrections or Profile Removal
            </h2>
            <p>
              We are committed to swift resolution of any genuine inaccuracy or legitimate profile dispute. If you represent an individual profiled on this site, or have verifiable documentation demonstrating an inaccuracy in our records, you may request an immediate review, fact correction, or profile removal.
            </p>
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-950 dark:text-indigo-200 text-xs sm:text-sm">
              <p className="font-semibold mb-1">How to file a correction or removal request:</p>
              <p>
                Visit our{" "}
                <Link
                  href="/contact"
                  className="font-bold underline text-indigo-600 dark:text-indigo-400"
                >
                  Contact & Corrections form
                </Link>{" "}
                and select &ldquo;Profile Fact Correction&rdquo; or &ldquo;Profile Removal Request&rdquo;. Please supply relevant citations or proof of identity for expediting your request.
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. Media & Imagery Notice
            </h2>
            <p>
              ProfileBook utilizes neutral vector placeholders and standardized geometric monograms to prevent copyright infringement. When third-party licensed media (e.g. Wikimedia Commons CC BY-SA) is incorporated, explicit image credits and source licenses are prominently displayed.
            </p>
          </section>
        </div>
      </div>

      {/* Directory & Wikipedia Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
        <div className="space-y-1 text-center max-w-lg mx-auto">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Search Personalities in ProfileBook &amp; Wikipedia
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Instant dual lookup across published profiles and open Wikipedia articles.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <SearchBar
            placeholder="Search personalities (e.g. Marie Curie, Nelson Mandela, Messi)..."
            size="large"
          />
        </div>
      </div>
    </div>
  );
}

