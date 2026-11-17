import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const popularCategories = [
    { title: "Famous Actors", href: "/category/actors" },
    { title: "Famous Singers", href: "/category/singers" },
    { title: "Football Players", href: "/category/footballers" },
    { title: "Cricket Players", href: "/category/cricketers" },
    { title: "Scientists & Researchers", href: "/category/scientists" },
    { title: "Startup Founders", href: "/category/startup-founders" },
    { title: "World Leaders", href: "/category/politicians" },
    { title: "Inventors", href: "/category/inventors" },
  ];

  return (
    <footer className="relative border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 mt-20 transition-colors">
      {/* Brand Accent Top Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 to-cyan-400" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="inline-block group">
              <Logo size="lg" />
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              The open, high-fidelity biographical directory documenting the milestones, achievements, and legacies of world-renowned personalities across every domain.
            </p>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {popularCategories.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Directory & Countries */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Explore Directory
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/people"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-slate-800 dark:text-slate-200"
                >
                  Famous Personalities (A–Z)
                </Link>
              </li>
              <li>
                <Link
                  href="/#categories"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  All 25 Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/countries"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Personalities by Country
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Search Database
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  About ProfileBook
                </Link>
              </li>
              <li>
                <Link
                  href="/why-ice-maker-stopped-working"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Ice Maker Diagnostic Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/editorial-policy"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Editorial &amp; Verification Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/attribution-policy"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Sources &amp; Attribution (CC BY-SA)
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  Legal Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Request Correction / Removal
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Editorial Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} ProfileBook. All biographical information is compiled from public domain and freely accessible historical records.</p>
          <p className="flex items-center gap-1 font-medium">
            Next.js Static Generation
          </p>
        </div>
      </div>
    </footer>
  );
}
