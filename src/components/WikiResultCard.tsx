"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** A Wikipedia discovery result, as returned by /api/search (deep mode)
 *  and by smartSearch. Shared by the results page (server-rendered
 *  initial batch) and SearchLoadMore (client-rendered pages) so every
 *  page of results looks identical. */
export interface WikiCardItem {
  id: number;
  key: string;
  name: string;
  description: string;
  excerpt: string;
  thumbnail: string | null;
  url: string;
}

export default function WikiResultCard({ item }: { item: WikiCardItem }) {
  return (
    <div className="group flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
          {item.thumbnail ? (
            <Image
              src={item.thumbnail}
              alt={item.name}
              fill
              sizes="96px"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl">
              <span>{item.name.substring(0, 2).toUpperCase()}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 uppercase">
              Wikipedia
            </span>
          </div>

          <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {item.name}
          </h4>

          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 line-clamp-1">
            {item.description}
          </p>

          {item.excerpt && (
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1">
              {item.excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 font-medium">
          Attribution: CC BY-SA 4.0
        </span>

        <Link
          href={item.url}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
