import Link from "next/link";
import Image from "next/image";
import {
  getAllCategories,
  getFeaturedProfiles,
  getLatestProfiles,
  getAllCountries,
  getProfilesByCategory,
} from "@/lib/data";
import WikiLiveSearch from "@/components/WikiLiveSearch";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import ProfileCard from "@/components/ProfileCard";
import { Sparkles, Globe, Clock, Layers, ShieldCheck, Flame, Compass } from "lucide-react";

export default function HomePage() {
  const categories = getAllCategories();
  const featuredProfiles = getFeaturedProfiles(6);
  const latestProfiles = getLatestProfiles(6);
  const countries = getAllCountries();

  // Pre-calculate profile counts per category
  const categoryCounts: Record<string, number> = {};
  for (const cat of categories) {
    categoryCounts[cat.slug] = getProfilesByCategory(cat.slug).length;
  }

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Primary Section: Live Wikipedia Search (Opens immediately when visiting website) */}
      <section className="relative pt-2 pb-6 max-w-5xl mx-auto overflow-hidden">
        {/* Colorful Multi-Layer Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-indigo-500/25 via-blue-500/20 to-purple-500/15 dark:from-indigo-600/30 dark:via-purple-600/25 dark:to-cyan-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/3 w-80 h-80 bg-gradient-to-br from-pink-500/15 via-purple-500/15 to-indigo-500/20 dark:from-purple-600/20 dark:to-pink-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: "2s" }} />

        <div className="relative z-10">
          <WikiLiveSearch />
        </div>

        {/* Hero Visual Spotlight Graphic */}
        <div className="relative pt-10 max-w-4xl mx-auto">
          <div className="text-center mb-3">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
              ✦ Explore Curated Profile Highlights ✦
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {[
              {
                slug: "shah-rukh-khan",
                name: "Shah Rukh Khan",
                role: "Bollywood Icon",
                img: "/avatars/shah-rukh-khan.jpg",
                theme: "hover:border-amber-400 dark:hover:border-amber-500/60 hover:shadow-amber-500/15 text-amber-600 dark:text-amber-400",
                badgeBorder: "border-amber-400/40",
              },
              {
                slug: "leonardo-dicaprio",
                name: "Leonardo DiCaprio",
                role: "Oscar Winner",
                img: "/avatars/leonardo-dicaprio.jpg",
                theme: "hover:border-purple-400 dark:hover:border-purple-500/60 hover:shadow-purple-500/15 text-purple-600 dark:text-purple-400",
                badgeBorder: "border-purple-400/40",
              },
              {
                slug: "lionel-messi",
                name: "Lionel Messi",
                role: "World Cup Champion",
                img: "/avatars/lionel-messi.jpg",
                theme: "hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:shadow-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                badgeBorder: "border-emerald-400/40",
              },
              {
                slug: "albert-einstein",
                name: "Albert Einstein",
                role: "Theoretical Physicist",
                img: "/avatars/albert-einstein.jpg",
                theme: "hover:border-cyan-400 dark:hover:border-cyan-500/60 hover:shadow-cyan-500/15 text-cyan-600 dark:text-cyan-400",
                badgeBorder: "border-cyan-400/40",
              },
            ].map((hero, idx) => (
              <Link
                key={hero.slug}
                href={`/people/${hero.slug}`}
                className={`group p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 card-hover-effect flex items-center gap-3 ${hero.theme} ${
                  idx % 2 === 0 ? "animate-float" : "animate-float-delayed"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 ${hero.badgeBorder} shadow-sm`}>
                  <Image
                    src={hero.img}
                    alt={hero.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-inherit transition-colors">
                    {hero.name}
                  </h4>
                  <p className="text-[11px] font-semibold truncate opacity-90">
                    {hero.role}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section id="featured" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              Featured Personalities
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Icons whose indelible contributions redefined their respective industries worldwide.
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View all directory</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProfiles.map((profile) => (
            <ProfileCard key={profile.slug} profile={profile} />
          ))}
        </div>
      </section>

      {/* All 25 Categories */}
      <section id="categories" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <Layers className="w-3.5 h-3.5" />
              <span>Curated Encyclopedia</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Browse by Industry & Profession
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Explore 25 dedicated industry archives documenting iconic figures from cinema to medical breakthroughs.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shrink-0 self-start sm:self-auto">
            25 Global Categories
          </span>
        </div>

        {/* Industry & Wikipedia Dual Search Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Search Personalities Across Any Industry or Live Wikipedia
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hidden sm:inline">
              Instant Dual Search
            </span>
          </div>
          <SearchBar
            placeholder="Search personalities (e.g. Elon Musk, Cristiano Ronaldo, Marie Curie, Shah Rukh Khan)..."
            size="large"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              count={categoryCounts[category.slug]}
            />
          ))}
        </div>
      </section>

      {/* Latest Added Profiles */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Latest Profile Additions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Recently compiled historical documents and contemporary profiles with genuine portraits.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {latestProfiles.map((profile) => (
            <ProfileCard key={profile.slug} profile={profile} />
          ))}
        </div>
      </section>

      {/* Browse by Country */}
      <section className="space-y-6 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/60 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Browse by Country
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Discover famous thinkers, creators, and athletes organized by nation of origin.
            </p>
          </div>
          <Link
            href="/countries"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            All countries &rarr;
          </Link>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {countries.map((c, idx) => {
            const colorAccents = [
              "hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 badge-blue",
              "hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 badge-emerald",
              "hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 badge-purple",
              "hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 badge-amber",
              "hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-400 badge-rose",
              "hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 badge-cyan",
            ];
            const accent = colorAccents[idx % colorAccents.length];

            return (
              <Link
                key={c.slug}
                href={`/countries/${c.slug}`}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${accent}`}
              >
                <span>{c.country}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-700 font-bold text-indigo-600 dark:text-indigo-400">
                  {c.count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
