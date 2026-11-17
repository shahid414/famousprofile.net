import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import SearchBar from "@/components/SearchBar";
import { Mail, Clock, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Corrections - ProfileBook",
  description: "Submit fact corrections, profile addition suggestions, or removal requests to the ProfileBook editorial team.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumbs items={[{ label: "Contact & Corrections" }]} />

      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Contact Editorial Team
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl">
          We welcome factual corrections, verified updates, new profile recommendations, and removal requests. Please supply relevant public citations with your message.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">Email Address</h4>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">editorial@profilebook.org</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">Response Window</h4>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Within 24–48 Hours</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400">Correction Policy</h4>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Strict Source Check</p>
          </div>
        </div>
      </div>

      {/* Search Before Submitting */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Check Existing Profiles or Wikipedia Before Submitting
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hidden sm:inline">
            Direct &amp; Live Wiki Dual Search
          </span>
        </div>
        <SearchBar
          placeholder="Search if a personality already exists on our site or Wikipedia..."
          size="large"
        />
      </div>

      {/* Interactive Form */}
      <ContactForm />
    </div>
  );
}

