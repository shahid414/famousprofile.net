import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchBar from "@/components/SearchBar";

export const metadata: Metadata = {
  title: "Privacy Policy - ProfileBook",
  description: "ProfileBook privacy policy regarding data collection, cookies, and local theme preferences.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-12 shadow-sm space-y-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last updated: October 2026
        </p>

        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Overview
            </h2>
            <p>
              ProfileBook is built with privacy-first principles. We operate as a statically generated reference encyclopedia and do not require user accounts, passwords, or personal profiles to browse our content.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Data We Do Not Collect
            </h2>
            <p>
              We do not track your personal identity, do not sell data to advertisers, and do not maintain private user databases.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Local Storage Usage
            </h2>
            <p>
              We use your browser&apos;s local storage (<code>localStorage</code>) strictly to save your preferred visual color theme (Light mode or Dark mode). This setting is stored entirely on your device and is never transmitted to our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. Contact and Correction Submissions
            </h2>
            <p>
              When you submit a fact correction, verification request, or removal request via our contact page, your submitted contact email is utilized solely to reply regarding the status of your inquiry.
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

