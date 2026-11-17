"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, FolderTree, Users, Sparkles, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "People", href: "/people", icon: Users },
    { label: "Categories", href: "/#categories", icon: FolderTree },
    { label: "Countries", href: "/countries", icon: Globe },
    { label: "Featured", href: "/#featured" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors shadow-sm">
      {/* Top Colorful Accent Line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 to-cyan-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group shrink-0 hover:opacity-95 transition flex items-center"
        >
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            href="/people"
            className={`transition flex items-center gap-1.5 ${
              pathname === "/people"
                ? "text-indigo-600 dark:text-indigo-400 font-bold"
                : "hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            <Users className="w-4 h-4 text-indigo-500" />
            <span>People</span>
          </Link>

          <Link
            href="/#categories"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5"
          >
            <FolderTree className="w-4 h-4 text-purple-500" />
            <span>Categories</span>
          </Link>

          <Link
            href="/countries"
            className={`transition flex items-center gap-1.5 ${
              pathname === "/countries"
                ? "text-indigo-600 dark:text-indigo-400 font-bold"
                : "hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-500" />
            <span>Countries</span>
          </Link>

          {/* Wiki Live Search Badge */}
          <Link
            href="/wiki-search"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition shadow-sm ${
              pathname === "/wiki-search"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/25 ring-2 ring-indigo-500/30"
                : "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/70 dark:to-purple-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:from-indigo-600 hover:to-purple-600 hover:text-white"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Wiki Live Search</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </Link>

          <Link
            href="/#featured"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Featured
          </Link>

          <Link
            href="/about"
            className={`transition ${
              pathname === "/about"
                ? "text-indigo-600 dark:text-indigo-400 font-bold"
                : "hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={`transition ${
              pathname === "/contact"
                ? "text-indigo-600 dark:text-indigo-400 font-bold"
                : "hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Medium Screen Nav (md to lg) */}
        <nav className="hidden md:flex lg:hidden items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
          <Link href="/people" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            People
          </Link>
          <Link href="/#categories" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Categories
          </Link>
          <Link href="/countries" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Countries
          </Link>
          <Link
            href="/wiki-search"
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
          >
            Wiki Search
          </Link>
        </nav>

        {/* Right Actions: Search Directory Link, Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700/80 transition"
            title="Search Personalities Directory"
          >
            <Search className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Search</span>
          </Link>

          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/people"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 transition"
          >
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Famous Personalities (A–Z)</span>
          </Link>

          <Link
            href="/#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 transition"
          >
            <FolderTree className="w-4 h-4 text-purple-500" />
            <span>Categories (All 25)</span>
          </Link>

          <Link
            href="/countries"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:text-cyan-600 transition"
          >
            <Globe className="w-4 h-4 text-cyan-500" />
            <span>Browse by Country</span>
          </Link>

          <Link
            href="/wiki-search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/60 dark:via-purple-950/40 dark:to-pink-950/40 border border-indigo-200 dark:border-indigo-800"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Wikipedia Search</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white">Live API</span>
          </Link>

          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search Profiles</span>
          </Link>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs text-slate-600 dark:text-slate-400">
            <Link
              href="/#featured"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Featured
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
