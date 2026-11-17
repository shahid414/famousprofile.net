import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchBar from "@/components/SearchBar";
import { ShieldCheck, ExternalLink, Globe, FileCheck, CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Sources & Attribution Policy (CC BY-SA 4.0)",
  description:
    "Explanation of ProfileBook's compliance with Wikipedia's Creative Commons CC BY-SA 4.0 license, Wikimedia Commons media usage, and citation attribution standards.",
  alternates: {
    canonical: "https://profilebook.org/attribution-policy",
  },
  openGraph: {
    title: "Sources & Attribution Policy | ProfileBook",
    description: "Creative Commons and Wikimedia Commons licensing transparency on ProfileBook.",
    url: "https://profilebook.org/attribution-policy",
  },
};

export default function AttributionPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: "Sources & Attribution Policy" }]} />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-12 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
          <FileCheck className="w-4 h-4" />
          <span>Licensing &amp; Open Knowledge</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sources &amp; Content Attribution Policy
        </h1>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Compliant with Creative Commons CC BY-SA 4.0 • Updated October 2026
        </p>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          ProfileBook is committed to the ethical dissemination of open knowledge. This page outlines how we cite external encyclopedias, attribute public authors, and uphold Creative Commons licensing frameworks.
        </p>
      </div>

      {/* Detailed Policy Sections */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
        {/* Section 1: Wikipedia Text License */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            1. Wikipedia Content Attribution (CC BY-SA 4.0)
          </h2>
          <p>
            When ProfileBook presents dynamic summary or biographical information retrieved via the English Wikipedia REST API, such text is made available under the{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-semibold underline inline-flex items-center gap-1"
            >
              Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            .
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs sm:text-sm">
            <span className="font-bold text-slate-900 dark:text-white block">Required Attribution Elements We Provide:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              <li>Direct hyperlink back to the canonical Wikipedia article page.</li>
              <li>Clear statement of authorship credit to Wikipedia contributors.</li>
              <li>Notice that adapted text remains available under CC BY-SA 4.0.</li>
            </ul>
          </div>
        </section>

        {/* Section 2: Media & Imagery Licensing */}
        <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            2. Wikimedia Commons &amp; Imagery Licensing
          </h2>
          <p>
            Photographs and portraits featured on ProfileBook are selected strictly from public domain repositories or freely licensed media hosted on{" "}
            <a
              href="https://commons.wikimedia.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 underline"
            >
              Wikimedia Commons
            </a>
            .
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Each profile includes an explicit image credit specifying the source and copyright designation (e.g. Public Domain, CC BY-SA 3.0, or CC BY 2.0). When no freely licensed photograph exists for a personality, ProfileBook employs a neutral typographic vector monogram to ensure full intellectual property integrity.
          </p>
        </section>

        {/* Section 3: DMCA & Copyright Inquiry */}
        <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            3. Copyright Inquiries &amp; Takedown Requests
          </h2>
          <p>
            If you are a copyright holder and believe that any content or imagery hosted on ProfileBook infringes upon your exclusive rights, please reach out directly:
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Email: <span className="text-indigo-600 dark:text-indigo-400">editorial@profilebook.org</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Please include the specific URL, proof of ownership or authorization, and your contact information. All verifiable requests are resolved within 24 to 48 hours.
          </p>
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
