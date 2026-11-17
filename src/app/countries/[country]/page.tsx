import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCountries, getProfilesByCountry } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProfileCard from "@/components/ProfileCard";
import SearchBar from "@/components/SearchBar";
import { MapPin, Users, Sparkles } from "lucide-react";

interface Props {
  params: {
    country: string;
  };
}

export async function generateStaticParams() {
  const countries = getAllCountries();
  return countries.map((c) => ({
    country: c.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const countries = getAllCountries();
  const current = countries.find((c) => c.slug === params.country);
  if (!current) return {};

  return {
    title: `Famous People from ${current.country} - ProfileBook`,
    description: `Biographies, career accomplishments, and profiles of famous individuals from ${current.country}.`,
    alternates: {
      canonical: `https://profilebook.org/countries/${params.country}`,
    },
  };
}

export default function CountryDetailPage({ params }: Props) {
  const countries = getAllCountries();
  const current = countries.find((c) => c.slug === params.country);

  if (!current) {
    notFound();
  }

  const profiles = getProfilesByCountry(params.country);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Countries", href: "/countries" },
          { label: current.country },
        ]}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm relative">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Country Archive</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Famous People from {current.country}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
            Explore curated profiles of prominent figures, leaders, athletes, and artists originating from or representing {current.country}.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Users className="w-4 h-4 text-slate-400" />
            <span>
              <strong className="text-slate-900 dark:text-white">{profiles.length}</strong> profiles documented
            </span>
          </div>
        </div>
      </div>

      {/* Country Dual Search Bar */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Search Personalities from {current.country} or Live Wikipedia
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hidden sm:inline">
            Direct &amp; Live Wiki Dual Search
          </span>
        </div>
        <SearchBar
          placeholder={`Search ${current.country} figures or any personality worldwide (e.g. Marie Curie, Messi)...`}
          size="large"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {profiles.map((profile) => (
          <ProfileCard key={profile.slug} profile={profile} />
        ))}
      </div>
    </div>
  );
}

