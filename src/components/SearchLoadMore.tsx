"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import WikiResultCard, { type WikiCardItem } from "./WikiResultCard";

/**
 * Load More for the search results page.
 *
 * The first batch of Wikipedia results is server-rendered by /search;
 * this component fetches further pages from /api/search?deep=1 with
 * offset/limit. The deep pool is cached server-side (10 min), so every
 * page slices the SAME pool: each click returns genuinely new results,
 * never duplicates, and the original query / country / profession /
 * era filters still apply (the API re-derives the intent from the same
 * query string). Items already on screen are also skipped client-side
 * as a safety net in case the server pool ever refreshes mid-session.
 */
interface Props {
  query: string;
  /** Wikipedia items already shown (server-rendered first batch). */
  initialOffset: number;
  /** Total discovered Wikipedia items for this query. */
  wikiTotal: number;
  /** Ids of the initially shown items (seed for client-side dedup). */
  initialIds: number[];
  limit?: number;
}

export default function SearchLoadMore({
  query,
  initialOffset,
  wikiTotal,
  initialIds,
  limit = 30,
}: Props) {
  const [items, setItems] = useState<WikiCardItem[]>([]);
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialOffset < wikiTotal);
  const [error, setError] = useState<string | null>(null);
  const seenRef = useRef<Set<number>>(new Set(initialIds));

  async function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&deep=1&offset=${offset}&limit=${limit}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load more results.");
      const fresh = (data.wikipedia || []).filter(
        (w: WikiCardItem) => !seenRef.current.has(w.id)
      );
      fresh.forEach((w: WikiCardItem) => seenRef.current.add(w.id));
      setItems((prev) => [...prev, ...fresh]);
      const nextOffset = offset + (data.wikipedia || []).length;
      setOffset(nextOffset);
      setHasMore(Boolean(data.hasMore) && nextOffset < wikiTotal);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not load more results.");
    } finally {
      setLoading(false);
    }
  }

  const remaining = Math.max(0, wikiTotal - offset);

  return (
    <div className="space-y-6">
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => (
            <WikiResultCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {hasMore ? (
        <div className="text-center space-y-2 pt-2">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {loading ? "Loading more…" : `Load more (${remaining} remaining)`}
            </span>
          </button>
          {error && (
            <p className="text-xs text-amber-600 dark:text-amber-400">{error}</p>
          )}
        </div>
      ) : (
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-2">
          You&apos;ve seen all {wikiTotal} Wikipedia results for this search.
        </p>
      )}
    </div>
  );
}
