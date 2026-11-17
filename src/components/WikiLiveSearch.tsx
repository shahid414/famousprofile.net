"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Loader2,
  X,
  AlertCircle,
  Globe,
  Sparkles,
  User,
  ArrowRight,
} from "lucide-react";

interface WikiSearchResult {
  id: number;
  key: string;
  title: string;
  description: string;
  excerpt: string;
  thumbnail: string | null;
}

export default function WikiLiveSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<WikiSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const wikiCacheRef = useRef<Map<string, WikiSearchResult[]>>(new Map());

  // Debounce typing input (250ms) for dynamic search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  // Execute search when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 1) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setResults([]);
      setIsLoading(false);
      setErrorMsg(null);
      return;
    }

    const cacheKey = debouncedQuery.toLowerCase();
    if (wikiCacheRef.current.has(cacheKey)) {
      setResults(wikiCacheRef.current.get(cacheKey)!);
      setIsLoading(false);
      setErrorMsg(null);
      setHasSearched(true);
      return;
    }

    performSearch(debouncedQuery);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery]);

  const performSearch = async (searchTerm: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setErrorMsg(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/wiki/search?q=${encodeURIComponent(searchTerm)}`, {
        signal: controller.signal,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch results from Wikipedia.");
      }

      const list = data.results || [];
      wikiCacheRef.current.set(searchTerm.toLowerCase(), list);
      setResults(list);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Live search failed:", err);
        setErrorMsg(err.message || "An error occurred while connecting to Wikipedia.");
        setResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 1) {
      return;
    }
    performSearch(trimmed);
  };

  const clearSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setQuery("");
    setResults([]);
    setErrorMsg(null);
    setHasSearched(false);
    searchInputRef.current?.focus();
  };

  return (
    <div className="w-full space-y-8">
      {/* Search Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm">
          <Globe className="w-3.5 h-3.5 text-indigo-500 animate-spin" style={{ animationDuration: "12s" }} />
          <span>ProfileBook Live Search • Powered by Global Knowledge API</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Any{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Famous Personality
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Search millions of notable figures in real-time. View complete verified profiles directly within ProfileBook.
        </p>
      </div>

      {/* Responsive Search Bar with Search Button */}
      <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto">
        <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border-2 border-indigo-500/30 dark:border-indigo-500/40 bg-white dark:bg-slate-900 focus-within:border-indigo-600 dark:focus-within:border-indigo-400 transition-all duration-200">
          <div className="pl-4 text-slate-400">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any famous personality's name (e.g. Cristiano Ronaldo, Bill Gates, Einstein)..."
            className="w-full py-4 pl-3 pr-24 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1.5 mr-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Search</span>
          </button>
        </div>

        {/* Input Validation / Error Notification */}
        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>

      {/* Loading Skeleton Indicator */}
      {isLoading && (
        <div className="text-center py-10 space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
            Connecting to knowledge database...
          </p>
        </div>
      )}

      {/* No Results Message */}
      {!isLoading && hasSearched && results.length === 0 && !errorMsg && debouncedQuery && (
        <div className="text-center py-12 px-6 max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No matching personalities found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            No exact articles found for &ldquo;{debouncedQuery}&rdquo;. Try checking the spelling or typing the full name.
          </p>
        </div>
      )}

      {/* Search Results Grid (Direct links to /people/[slug] in ProfileBook UI) */}
      {!isLoading && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{results.length}</strong> matching figures for &ldquo;{debouncedQuery}&rdquo;
            </span>
            <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Instant Profile View
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {results.map((item) => {
              const profileSlug = encodeURIComponent(item.key.toLowerCase().replace(/_/g, "-"));
              const profileUrl = `/people/${profileSlug}`;

              return (
                <div
                  key={item.id}
                  className="group flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-300"
                >
                  <Link href={profileUrl} className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          sizes="96px"
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl">
                          <span>{item.title.substring(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {item.title}
                      </h3>

                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 line-clamp-1">
                        {item.description}
                      </p>

                      {item.excerpt && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed pt-1">
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>

                  {/* Card Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      ProfileBook Global Archive
                    </span>

                    <Link
                      href={profileUrl}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
