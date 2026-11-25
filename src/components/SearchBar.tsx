"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Loader2,
  X,
  Globe,
  ShieldCheck,
  ArrowRight,
  User,
} from "lucide-react";
import { ERA_LABELS } from "@/lib/searchIntent";

interface LocalProfileResult {
  type: "local";
  slug: string;
  name: string;
  category: string;
  profession: string;
  country: string;
  industry?: string;
  image: string;
  imageCredit: string;
  bio: string;
  url: string;
}

interface WikiProfileResult {
  type: "wikipedia";
  id: number;
  key: string;
  name: string;
  description: string;
  excerpt: string;
  thumbnail: string | null;
  url: string;
}

interface SearchIntentState {
  kind: string;
  country: string | null;
  profession: string | null;
  era: "new" | "modern" | "historical" | null;
}

interface Props {
  initialQuery?: string;
  placeholder?: string;
  size?: "compact" | "large";
  className?: string;
}

export default function SearchBar({
  initialQuery = "",
  placeholder = "Search personalities (e.g. Messi, Einstein, Michael Jackson)...",
  size = "compact",
  className = "",
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [localResults, setLocalResults] = useState<LocalProfileResult[]>([]);
  const [wikiResults, setWikiResults] = useState<WikiProfileResult[]>([]);
  const [intent, setIntent] = useState<SearchIntentState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, { local: LocalProfileResult[]; wikipedia: WikiProfileResult[]; intent: SearchIntentState | null }>>(new Map());
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch Dual Search API with 200ms debounce, AbortController, and In-Memory Caching
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 1) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setLocalResults([]);
      setWikiResults([]);
      setIntent(null);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    const cacheKey = trimmed.toLowerCase();
    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey)!;
      setLocalResults(cached.local);
      setWikiResults(cached.wikipedia);
      setIntent(cached.intent);
      setIsLoading(false);
      setIsOpen(true);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          const local = data.local || [];
          const wikipedia = data.wikipedia || [];
          const resolvedIntent: SearchIntentState | null = data.intent || null;
          cacheRef.current.set(cacheKey, { local, wikipedia, intent: resolvedIntent });
          setLocalResults(local);
          setWikiResults(wikipedia);
          setIntent(resolvedIntent);
          setIsOpen(true);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Dual Search API failed:", err);
        }
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  };

  const clearQuery = () => {
    setQuery("");
    setLocalResults([]);
    setWikiResults([]);
    setIntent(null);
    setIsOpen(false);
  };

  const totalResults = localResults.length + wikiResults.length;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div
          className={`relative flex items-center w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent ${size === "large" ? "py-2 px-3 text-base shadow-md" : "py-1.5 px-3 text-sm"
            }`}
        >
          <div className="shrink-0 text-slate-400 mr-2.5">
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            ) : (
              <Search className={size === "large" ? "w-5 h-5" : "w-4 h-4"} />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (totalResults > 0) setIsOpen(true);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />

          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition shrink-0 mr-1.5"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            className="shrink-0 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {/* DUAL SEARCH SUGGESTIONS DROPDOWN */}
      {isOpen && query.trim().length >= 1 && (
        <div
          className={`absolute top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto ${size === "compact"
            ? "left-0 sm:left-auto sm:right-0 w-[92vw] sm:w-[420px] max-w-[440px]"
            : "left-0 right-0 w-full"
            }`}
        >
          {/* Header Summary Bar */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Search results for &ldquo;<strong>{query.trim()}</strong>&rdquo;
            </span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {totalResults} results found
            </span>
          </div>

          {/* Interpreted-as chips (smart search intent) */}
          {intent && intent.kind !== "person" && (
            <div className="px-4 pt-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                Interpreted as:
              </span>
              {intent.country && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {intent.country}
                </span>
              )}
              {intent.profession && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                  {intent.profession}
                </span>
              )}
              {intent.era && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                  {ERA_LABELS[intent.era]}
                </span>
              )}
            </div>
          )}

          {totalResults === 0 && !isLoading && (
            <div className="p-8 text-center space-y-2">
              <User className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No profiles found
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No direct match on our website or Wikipedia. Try checking the spelling.
              </p>
            </div>
          )}

          {/* SECTION 1: Local Published Profiles (Priority First) */}
          {localResults.length > 0 && (
            <div className="p-3">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Verified on ProfileBook ({localResults.length})</span>
                </span>
                <span className="text-[10px] text-slate-400 lowercase">Published on website</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {localResults.map((item) => (
                  <Link
                    key={item.slug}
                    href={item.url}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 transition group"
                  >
                    <div className="relative w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="44px"
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-xs">
                          {item.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {item.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold">
                          Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.profession} • {item.country}
                      </p>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: Live Wikipedia Profiles */}
          {wikiResults.length > 0 && (
            <div className={`p-3 ${localResults.length > 0 ? "border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40" : ""}`}>
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                  <span>
                    {localResults.length > 0 ? "More Results from Wikipedia" : "Global Wikipedia Entries"} ({wikiResults.length})
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 lowercase">Live on-demand</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {wikiResults.map((item) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 transition group"
                  >
                    <div className="relative w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          fill
                          sizes="44px"
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-white font-bold text-xs">
                          {item.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {item.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          Wiki
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.description}
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:translate-x-0.5 transition flex items-center gap-1">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Footer View All Link */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={handleSearchSubmit}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <span>See full search results page for &ldquo;{query.trim()}&rdquo;</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
