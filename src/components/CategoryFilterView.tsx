"use client";

import { useState, useMemo } from "react";
import { Profile } from "@/types";
import ProfileCard from "./ProfileCard";
import { Search, Filter, ArrowUpDown, RotateCcw } from "lucide-react";

interface Props {
  profiles: Profile[];
}

export default function CategoryFilterView({ profiles }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "living" | "deceased">("all");
  const [sortBy, setSortBy] = useState<"az" | "za" | "newest">("az");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract unique countries
  const countries = useMemo(() => {
    const list = Array.from(new Set(profiles.map((p) => p.country).filter(Boolean)));
    return list.sort();
  }, [profiles]);

  // Extract unique industries
  const industries = useMemo(() => {
    const list = Array.from(new Set(profiles.map((p) => p.industry).filter(Boolean)));
    return list.sort() as string[];
  }, [profiles]);

  // Filter & Sort
  const filteredProfiles = useMemo(() => {
    return profiles
      .filter((p) => {
        // Search text
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(query) ||
            p.profession.toLowerCase().includes(query) ||
            (p.industry && p.industry.toLowerCase().includes(query)) ||
            (p.country && p.country.toLowerCase().includes(query)) ||
            p.bio.toLowerCase().includes(query);
          if (!matches) return false;
        }

        // Country filter
        if (selectedCountry !== "all" && p.country !== selectedCountry) {
          return false;
        }

        // Industry filter
        if (selectedIndustry !== "all" && p.industry !== selectedIndustry) {
          return false;
        }

        // Status filter
        if (statusFilter === "living" && p.deathDate) {
          return false;
        }
        if (statusFilter === "deceased" && !p.deathDate) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "az") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "za") {
          return b.name.localeCompare(a.name);
        }
        if (sortBy === "newest") {
          const yearA = parseInt(a.birthDate?.split("-")[0] || "0", 10);
          const yearB = parseInt(b.birthDate?.split("-")[0] || "0", 10);
          return yearB - yearA;
        }
        return 0;
      });
  }, [profiles, searchQuery, selectedCountry, selectedIndustry, statusFilter, sortBy]);

  // Reset page when filters change
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage) || 1;
  const validPage = Math.min(currentPage, totalPages);

  const paginatedProfiles = useMemo(() => {
    const start = (validPage - 1) * itemsPerPage;
    return filteredProfiles.slice(start, start + itemsPerPage);
  }, [filteredProfiles, validPage, itemsPerPage]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCountry("all");
    setSelectedIndustry("all");
    setStatusFilter("all");
    setSortBy("az");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCountry !== "all" ||
    selectedIndustry !== "all" ||
    statusFilter !== "all" ||
    sortBy !== "az";

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filter profiles in this category..."
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Country Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Industry Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => {
                setSelectedIndustry(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "all" | "living" | "deceased");
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Living & Deceased</option>
              <option value="living">Living Only</option>
              <option value="deceased">Deceased Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as "az" | "za" | "newest");
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="az">Name: A to Z</option>
              <option value="za">Name: Z to A</option>
              <option value="newest">Birth: Most Recent First</option>
            </select>
          </div>
        </div>

        {/* Status Count and Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredProfiles.length}</strong> of {profiles.length} profiles
          </span>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Profiles Grid */}
      {paginatedProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {paginatedProfiles.map((profile) => (
            <ProfileCard key={profile.slug} profile={profile} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            No profiles match your active filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Previous
          </button>
          <span className="text-xs text-slate-600 dark:text-slate-400 px-3">
            Page {validPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

