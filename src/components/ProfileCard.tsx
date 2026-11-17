"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Profile } from "@/types";
import { MapPin, Award, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

interface Props {
  profile: Profile;
}

export default function ProfileCard({ profile }: Props) {
  const [imgError, setImgError] = useState(false);
  const isDeceased = Boolean(profile.deathDate);

  const getYearsText = () => {
    const birthYear = profile.birthDate ? profile.birthDate.split("-")[0] : "";
    if (isDeceased) {
      const deathYear = profile.deathDate ? profile.deathDate.split("-")[0] : "";
      return `${birthYear} – ${deathYear}`;
    }
    return birthYear ? `b. ${birthYear}` : "";
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.replace(/\(.*?\)/g, "").trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const hasValidImage =
    Boolean(profile.image) &&
    profile.image.trim() !== "" &&
    profile.image !== "/avatars/placeholder.svg" &&
    !profile.image.endsWith("placeholder.svg") &&
    !imgError;

  // Curated category badge styles for vibrant color identity
  const categoryStyleMap: Record<string, { badge: string; dot: string; text: string; borderHover: string }> = {
    actors: {
      badge: "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-300/40 shadow-amber-500/25",
      dot: "bg-amber-200",
      text: "text-amber-600 dark:text-amber-400",
      borderHover: "hover:border-amber-400 dark:hover:border-amber-500/60 hover:shadow-amber-500/10",
    },
    singers: {
      badge: "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-300/40 shadow-purple-500/25",
      dot: "bg-pink-200",
      text: "text-purple-600 dark:text-purple-400",
      borderHover: "hover:border-purple-400 dark:hover:border-purple-500/60 hover:shadow-purple-500/10",
    },
    cricketers: {
      badge: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-300/40 shadow-emerald-500/25",
      dot: "bg-emerald-200",
      text: "text-emerald-600 dark:text-emerald-400",
      borderHover: "hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:shadow-emerald-500/10",
    },
    footballers: {
      badge: "bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-300/40 shadow-rose-500/25",
      dot: "bg-rose-200",
      text: "text-rose-600 dark:text-rose-400",
      borderHover: "hover:border-rose-400 dark:hover:border-rose-500/60 hover:shadow-rose-500/10",
    },
    scientists: {
      badge: "bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 text-white border-indigo-300/40 shadow-indigo-500/25",
      dot: "bg-cyan-200",
      text: "text-indigo-600 dark:text-indigo-400",
      borderHover: "hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:shadow-indigo-500/10",
    },
    doctors: {
      badge: "bg-gradient-to-r from-cyan-600 to-sky-600 text-white border-cyan-300/40 shadow-cyan-500/25",
      dot: "bg-cyan-200",
      text: "text-cyan-600 dark:text-cyan-400",
      borderHover: "hover:border-cyan-400 dark:hover:border-cyan-500/60 hover:shadow-cyan-500/10",
    },
    politicians: {
      badge: "bg-gradient-to-r from-blue-700 to-indigo-700 text-white border-blue-300/40 shadow-blue-500/25",
      dot: "bg-blue-200",
      text: "text-blue-600 dark:text-blue-400",
      borderHover: "hover:border-blue-400 dark:hover:border-blue-500/60 hover:shadow-blue-500/10",
    },
    "startup-founders": {
      badge: "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white border-fuchsia-300/40 shadow-fuchsia-500/25",
      dot: "bg-fuchsia-200",
      text: "text-fuchsia-600 dark:text-fuchsia-400",
      borderHover: "hover:border-fuchsia-400 dark:hover:border-fuchsia-500/60 hover:shadow-fuchsia-500/10",
    },
    youtubers: {
      badge: "bg-gradient-to-r from-red-600 to-rose-700 text-white border-red-300/40 shadow-red-500/25",
      dot: "bg-red-200",
      text: "text-red-600 dark:text-red-400",
      borderHover: "hover:border-red-400 dark:hover:border-red-500/60 hover:shadow-red-500/10",
    },
  };

  const currentTheme = categoryStyleMap[profile.category] || {
    badge: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-white/20 shadow-indigo-500/20",
    dot: "bg-indigo-300",
    text: "text-indigo-600 dark:text-indigo-400",
    borderHover: "hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-indigo-500/10",
  };

  return (
    <Link
      href={`/people/${profile.slug}`}
      className={`group flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl ${currentTheme.borderHover} hover:-translate-y-1.5 transition-all duration-300 cursor-pointer`}
    >
      {/* TOP HALF: Famous Person HD Portrait / Visual (50% of card) */}
      <div className="relative w-full h-64 sm:h-72 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {hasValidImage ? (
          <Image
            src={profile.image}
            alt={profile.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 384px"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white select-none">
            <span className="text-4xl font-extrabold tracking-wider opacity-90">
              {getInitials(profile.name)}
            </span>
            <span className="text-xs font-medium text-white/80 mt-1 uppercase tracking-widest">
              {profile.category}
            </span>
          </div>
        )}

        {/* Cinematic Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Top Badges: Category & Country */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase backdrop-blur-md border shadow-md ${currentTheme.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.dot} animate-pulse`} />
            {profile.category.replace(/-/g, " ")}
          </span>

          {profile.country && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/65 backdrop-blur-md text-white border border-white/15 shadow-sm">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span className="truncate max-w-[110px]">{profile.country}</span>
            </span>
          )}
        </div>

        {/* Bottom Image Overlay: Era / Status & Verified Badge */}
        <div className="absolute bottom-3 inset-x-3.5 flex items-center justify-between z-10 pointer-events-none text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wide text-white/95 drop-shadow-md">
              {getYearsText()}
            </span>
            {isDeceased && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                Memorial
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-500/40 shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Verified</span>
          </div>
        </div>
      </div>

      {/* BOTTOM HALF: Short Intro, Details & Click Action (50% of card) */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
        <div>
          {/* Subtitle / Profession with dynamic theme color */}
          <p className={`text-xs font-bold uppercase tracking-wider line-clamp-1 ${currentTheme.text}`}>
            {profile.profession}
          </p>

          {/* Famous Name */}
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mt-1 tracking-tight">
            {profile.name}
          </h3>

          {/* Short Intro / Bio */}
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mt-2.5 font-normal">
            {profile.bio}
          </p>
        </div>

        {/* Highlights Chips: Famous Works & Honors */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
            {profile.famousWorks && profile.famousWorks.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                <BookOpen className="w-3 h-3 text-indigo-500" />
                <span>{profile.famousWorks.length}+ Notable Works</span>
              </span>
            )}

            {profile.awards && profile.awards.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-medium">
                <Award className="w-3 h-3 text-amber-500" />
                <span>{profile.awards.length} Honors</span>
              </span>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-medium truncate max-w-[160px]">
              {profile.nickname ? `"${profile.nickname}"` : profile.industry || "Biography"}
            </span>
            <span className="inline-flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
              <span>View Profile</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
