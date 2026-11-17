import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchBar from "@/components/SearchBar";
import { ShieldCheck, BookOpen, Clock, CheckCircle2, AlertCircle, FileText, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Policy & Sourcing Standards",
  description:
    "Learn about ProfileBook's editorial guidelines, factual verification standards, neutrality policies, and rapid factual correction workflows.",
  alternates: {
    canonical: "https://profilebook.org/editorial-policy",
  },
  openGraph: {
    title: "Editorial Policy | ProfileBook",
    description: "Our standards of factual accuracy, neutrality, and transparent sourcing.",
    url: "https://profilebook.org/editorial-policy",
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: "Editorial Policy" }]} />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-12 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
          <Scale className="w-4 h-4" />
          <span>Trust &amp; Transparency</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Editorial Policy &amp; Standards
        </h1>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last reviewed: October 2026 • ProfileBook Editorial Board
        </p>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          At <strong>ProfileBook</strong>, our mission is to build a reliable, encyclopedic reference directory of world-renowned figures. We operate under strict principles of factual objectivity, independent verification, and complete source transparency.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
        {/* Section 1: Verification Principles */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            1. Core Principles of Verification
          </h2>
          <p>
            Every biographical profile published on ProfileBook must be substantiated by authoritative, publicly verifiable documentation. We never invent quotes, exaggerate awards, or publish unsubstantiated rumors.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-400 text-sm">
            <li><strong>Official Registers:</strong> Government birth/death records, official sports governing bodies (e.g. FIFA, ICC, Olympics), and academic registers.</li>
            <li><strong>Peer-Reviewed Sources:</strong> Nobel Prize official archives, university repositories, and national library catalogs.</li>
            <li><strong>Primary Open Encyclopedias:</strong> Well-referenced articles from the English Wikipedia under Creative Commons licensing.</li>
          </ul>
        </section>

        {/* Section 2: Neutrality & NPOV */}
        <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            2. Neutral Point of View (NPOV)
          </h2>
          <p>
            Biographical entries are presented without promotional spin or sensationalism. We describe careers through objective milestones: dates of tenure, verified achievements, notable published works, and documented honors. Controversies with widespread public documentation are represented proportionally, neutrally, and with attribution.
          </p>
        </section>

        {/* Section 3: Wikipedia Integration */}
        <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            3. Wikipedia API Integration &amp; Original Value
          </h2>
          <p>
            ProfileBook leverages the official English Wikipedia MediaWiki REST API as an external factual foundation. However, we do not republish raw scraped pages. Instead, we:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-400 text-sm">
            <li>Standardize biographical timelines into clean, scannable fact-sheets.</li>
            <li>Curate high-contrast, accessible visual presentations.</li>
            <li>Filter thin stubs or ambiguous redirect pages to ensure high search utility.</li>
            <li>Prominently display CC BY-SA 4.0 license attribution and original Wikipedia URLs.</li>
          </ul>
        </section>

        {/* Section 4: Correction Procedure */}
        <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            4. Factual Corrections &amp; Removal Requests
          </h2>
          <p>
            If you identify a factual error, misspelled name, or misattributed date in any profile, our editorial team investigates all submissions promptly:
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <AlertCircle className="w-4 h-4 text-indigo-500" />
              <span>How to submit a correction:</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Please submit corrections via our{" "}
              <a href="/contact" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">
                Contact &amp; Corrections Form
              </a>{" "}
              along with a verifiable public citation. All valid corrections are processed and updated within <strong>24 to 48 business hours</strong>.
            </p>
          </div>
        </section>
      </div>

      {/* Search Directory or Wikipedia */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
        <div className="space-y-1 text-center max-w-lg mx-auto">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Search Personalities Across Our Directory
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Instant dual search across our verified profiles and open Wikipedia articles.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <SearchBar
            placeholder="Search figures (e.g. Marie Curie, Nelson Mandela, Messi)..."
            size="large"
          />
        </div>
      </div>
    </div>
  );
}
