import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
  getCategoryBySlug,
  getProfilesByCategory,
} from "@/lib/data";
import CategoryFilterView from "@/components/CategoryFilterView";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryIcon from "@/components/CategoryIcon";
import SearchBar from "@/components/SearchBar";
import { Sparkles } from "lucide-react";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};

  return {
    title: `${category.title} Profiles - Biographies & Facts`,
    description: category.seoDescription,
    alternates: {
      canonical: `https://profilebook.org/category/${params.slug}`,
    },
    openGraph: {
      title: `${category.title} - ProfileBook`,
      description: category.seoDescription,
      url: `https://profilebook.org/category/${params.slug}`,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const profiles = getProfilesByCategory(category.slug);

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: category.title }]} />

      {/* Header & SEO Intro */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold">
              <CategoryIcon name={category.icon} className="w-4 h-4" />
              <span>Category Archive</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {category.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {category.seoDescription} Browse notable careers, pivotal achievements, prestigious honors, and full life timelines below.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 self-start md:self-auto">
            <div>
              <span className="block text-2xl font-bold text-slate-900 dark:text-white">
                {profiles.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Curated Profiles
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Dual Search Bar */}
      <div className="bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Search Personalities in {category.title} or Live Wikipedia
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hidden sm:inline">
            Direct &amp; Live Wiki Dual Search
          </span>
        </div>
        <SearchBar
          placeholder={`Search ${category.title} or any figure worldwide (e.g. Marie Curie, Messi, Einstein)...`}
          size="large"
        />
      </div>

      {/* Interactive Profile Filter View */}
      <CategoryFilterView profiles={profiles} />
    </div>
  );
}

