import Link from "next/link";
import { Category } from "@/types";
import CategoryIcon, { categoryThemeMap } from "./CategoryIcon";
import { ArrowRight, Sparkles, FolderOpen } from "lucide-react";

interface Props {
  category: Category;
  count?: number;
}

export default function CategoryCard({ category, count }: Props) {
  const theme = categoryThemeMap[category.slug] || {
    bg: "from-indigo-500/10 to-purple-500/10",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "group-hover:border-indigo-400/60 dark:group-hover:border-indigo-500/50",
    glow: "group-hover:shadow-indigo-500/10",
    iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/30",
  };

  const isCompleteCategory = count && count >= 30;

  return (
    <Link
      href={`/category/${category.slug}`}
      className={`group relative p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl hover:shadow-2xl ${theme.border} ${theme.glow} hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer`}
    >
      {/* Subtle Ambient Hover Glow in background */}
      <div
        className={`absolute -right-12 -top-12 w-32 h-32 rounded-full bg-gradient-to-br ${theme.bg} blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative z-10 space-y-4">
        {/* Top Header Row: Professional Icon + Profile Count Pill */}
        <div className="flex items-center justify-between gap-3">
          <div
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center p-3 shadow-lg ${theme.iconBg} group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300`}
          >
            <CategoryIcon name={category.icon} className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="flex items-center gap-1.5">
            {isCompleteCategory ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{count} Profiles</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">
                <span>{typeof count === "number" ? `${count} Profiles` : "Curated"}</span>
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 tracking-tight">
            {category.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-normal">
            {category.seoDescription}
          </p>
        </div>
      </div>

      {/* Bottom Action Row with Direct Page Link Indicator */}
      <div className="relative z-10 mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 font-mono group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors truncate max-w-[140px]">
          <FolderOpen className="w-3 h-3 text-slate-400" />
          <span>/{category.slug}</span>
        </span>

        <span className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
