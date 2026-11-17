"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [destroyed, setDestroyed] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    try {
      // Check if user already saw the splash screen in this browser session
      const alreadySeen = sessionStorage.getItem("profilebook_splash_seen");
      if (alreadySeen) {
        document.documentElement.classList.add("splash-hidden");
        setDestroyed(true);
        return;
      }

      // Check user reduced motion preference for accessibility
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        sessionStorage.setItem("profilebook_splash_seen", "true");
        document.documentElement.classList.add("splash-hidden");
        setDestroyed(true);
        return;
      }

      // Mark as seen for this session
      sessionStorage.setItem("profilebook_splash_seen", "true");

      // 1. Tagline appears smoothly at 400ms
      const taglineTimer = setTimeout(() => {
        setShowTagline(true);
      }, 400);

      // 2. Start smooth fade-out transition at 1800ms
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 1800);

      // 3. Completely unmount from DOM at 2450ms
      const destroyTimer = setTimeout(() => {
        document.documentElement.classList.add("splash-hidden");
        setDestroyed(true);
      }, 2450);

      return () => {
        clearTimeout(taglineTimer);
        clearTimeout(fadeOutTimer);
        clearTimeout(destroyTimer);
      };
    } catch (e) {
      setDestroyed(true);
    }
  }, []);

  if (destroyed) return null;

  return (
    <div
      id="profilebook-splash-screen"
      onClick={() => {
        // Allow instant dismiss on click/tap
        setIsFadingOut(true);
        setTimeout(() => {
          document.documentElement.classList.add("splash-hidden");
          setDestroyed(true);
        }, 200);
      }}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-slate-950 select-none cursor-pointer transition-all duration-700 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none scale-102" : "opacity-100 scale-100"
      }`}
      aria-label="ProfileBook Loading Screen"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col items-center max-w-sm sm:max-w-md px-6 text-center space-y-6">
        {/* Animated Brand Logo Container */}
        <div className="relative w-64 sm:w-80 md:w-96 aspect-[887/530] transition-transform duration-700 ease-out transform">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 -inset-x-8 bg-blue-500/10 dark:bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Light Mode Logo */}
          <Image
            src="/logo-main.png"
            alt="ProfileBook Logo"
            fill
            sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
            className="dark:hidden object-contain drop-shadow-md animate-fade-in-scale"
            priority
          />

          {/* Dark Mode Logo (High Contrast) */}
          <Image
            src="/logo-main-dark.png"
            alt="ProfileBook Logo"
            fill
            sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
            className="hidden dark:block object-contain drop-shadow-md animate-fade-in-scale"
            priority
          />
        </div>

        {/* Animated Tagline */}
        <div
          className={`flex items-center justify-center gap-2 sm:gap-3 transition-all duration-700 ease-out transform ${
            showTagline
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
        >
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-slate-800 dark:text-slate-200">
            Discover
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-slate-800 dark:text-slate-200">
            Explore
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-slate-800 dark:text-slate-200">
            Learn
          </span>
        </div>

        {/* Elegant Brand Progress Line */}
        <div className="w-32 sm:w-44 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-slate-900 via-indigo-600 to-blue-500 dark:from-indigo-400 dark:via-blue-500 dark:to-cyan-400 rounded-full animate-splash-progress" />
        </div>
      </div>
    </div>
  );
}
