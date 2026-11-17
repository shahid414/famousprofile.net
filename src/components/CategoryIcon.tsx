import React from "react";
import {
  Film,
  Mic,
  ShieldCheck,
  Trophy,
  Landmark,
  HeartPulse,
  Atom,
  Briefcase,
  Rocket,
  Video,
  Share2,
  Sparkles,
  BookOpen,
  Clapperboard,
  Medal,
  Swords,
  Flame,
  Newspaper,
  Scale,
  Gamepad2,
  Smile,
  Tv,
  Lightbulb,
  TrendingUp,
  Building2,
  Folder,
} from "lucide-react";

interface Props {
  name: string;
  categorySlug?: string;
  className?: string;
}

const iconComponentMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Film,
  Mic,
  ShieldCheck,
  Trophy,
  Landmark,
  HeartPulse,
  Atom,
  Briefcase,
  Rocket,
  Video,
  Share2,
  Sparkles,
  BookOpen,
  Clapperboard,
  Medal,
  Swords,
  Flame,
  Newspaper,
  Scale,
  Gamepad2,
  Smile,
  Tv,
  Lightbulb,
  TrendingUp,
  Building2,
};

// Specialized curated color themes for each industry
export const categoryThemeMap: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    glow: string;
    iconBg: string;
  }
> = {
  actors: {
    bg: "from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "group-hover:border-amber-400/60 dark:group-hover:border-amber-500/50",
    glow: "group-hover:shadow-amber-500/10",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/30",
  },
  singers: {
    bg: "from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "group-hover:border-purple-400/60 dark:group-hover:border-purple-500/50",
    glow: "group-hover:shadow-purple-500/10",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-purple-500/30",
  },
  cricketers: {
    bg: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "group-hover:border-emerald-400/60 dark:group-hover:border-emerald-500/50",
    glow: "group-hover:shadow-emerald-500/10",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30",
  },
  footballers: {
    bg: "from-rose-500/10 to-red-500/10 dark:from-rose-500/20 dark:to-red-500/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "group-hover:border-rose-400/60 dark:group-hover:border-rose-500/50",
    glow: "group-hover:shadow-rose-500/10",
    iconBg: "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-rose-500/30",
  },
  politicians: {
    bg: "from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "group-hover:border-blue-400/60 dark:group-hover:border-blue-500/50",
    glow: "group-hover:shadow-blue-500/10",
    iconBg: "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/30",
  },
  doctors: {
    bg: "from-cyan-500/10 to-sky-500/10 dark:from-cyan-500/20 dark:to-sky-500/20",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "group-hover:border-cyan-400/60 dark:group-hover:border-cyan-500/50",
    glow: "group-hover:shadow-cyan-500/10",
    iconBg: "bg-gradient-to-br from-cyan-500 to-sky-600 text-white shadow-cyan-500/30",
  },
  scientists: {
    bg: "from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "group-hover:border-indigo-400/60 dark:group-hover:border-indigo-500/50",
    glow: "group-hover:shadow-indigo-500/10",
    iconBg: "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/30",
  },
  "business-leaders": {
    bg: "from-slate-500/10 to-zinc-500/10 dark:from-slate-500/20 dark:to-zinc-500/20",
    text: "text-slate-700 dark:text-slate-300",
    border: "group-hover:border-slate-400/60 dark:group-hover:border-slate-500/50",
    glow: "group-hover:shadow-slate-500/10",
    iconBg: "bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-slate-500/30",
  },
  "startup-founders": {
    bg: "from-fuchsia-500/10 to-purple-500/10 dark:from-fuchsia-500/20 dark:to-purple-500/20",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    border: "group-hover:border-fuchsia-400/60 dark:group-hover:border-fuchsia-500/50",
    glow: "group-hover:shadow-fuchsia-500/10",
    iconBg: "bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-fuchsia-500/30",
  },
  youtubers: {
    bg: "from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20",
    text: "text-red-600 dark:text-red-400",
    border: "group-hover:border-red-400/60 dark:group-hover:border-red-500/50",
    glow: "group-hover:shadow-red-500/10",
    iconBg: "bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-red-500/30",
  },
  "social-media-influencers": {
    bg: "from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20",
    text: "text-pink-600 dark:text-pink-400",
    border: "group-hover:border-pink-400/60 dark:group-hover:border-pink-500/50",
    glow: "group-hover:shadow-pink-500/10",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-pink-500/30",
  },
  models: {
    bg: "from-rose-500/10 to-purple-500/10 dark:from-rose-500/20 dark:to-purple-500/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "group-hover:border-rose-400/60 dark:group-hover:border-rose-500/50",
    glow: "group-hover:shadow-rose-500/10",
    iconBg: "bg-gradient-to-br from-rose-500 to-purple-600 text-white shadow-rose-500/30",
  },
  writers: {
    bg: "from-amber-600/10 to-yellow-600/10 dark:from-amber-600/20 dark:to-yellow-600/20",
    text: "text-amber-700 dark:text-amber-400",
    border: "group-hover:border-amber-500/60 dark:group-hover:border-amber-500/50",
    glow: "group-hover:shadow-amber-600/10",
    iconBg: "bg-gradient-to-br from-amber-600 to-yellow-700 text-white shadow-amber-600/30",
  },
  directors: {
    bg: "from-violet-500/10 to-indigo-500/10 dark:from-violet-500/20 dark:to-indigo-500/20",
    text: "text-violet-600 dark:text-violet-400",
    border: "group-hover:border-violet-400/60 dark:group-hover:border-violet-500/50",
    glow: "group-hover:shadow-violet-500/10",
    iconBg: "bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-violet-500/30",
  },
  athletes: {
    bg: "from-lime-500/10 to-emerald-500/10 dark:from-lime-500/20 dark:to-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "group-hover:border-emerald-400/60 dark:group-hover:border-emerald-500/50",
    glow: "group-hover:shadow-emerald-500/10",
    iconBg: "bg-gradient-to-br from-lime-500 to-emerald-600 text-white shadow-emerald-500/30",
  },
  boxers: {
    bg: "from-red-600/10 to-orange-600/10 dark:from-red-600/20 dark:to-orange-600/20",
    text: "text-red-700 dark:text-red-400",
    border: "group-hover:border-red-500/60 dark:group-hover:border-red-500/50",
    glow: "group-hover:shadow-red-600/10",
    iconBg: "bg-gradient-to-br from-red-600 to-orange-600 text-white shadow-red-600/30",
  },
  wrestlers: {
    bg: "from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "group-hover:border-orange-400/60 dark:group-hover:border-orange-500/50",
    glow: "group-hover:shadow-orange-500/10",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-500/30",
  },
  journalists: {
    bg: "from-sky-500/10 to-blue-500/10 dark:from-sky-500/20 dark:to-blue-500/20",
    text: "text-sky-600 dark:text-sky-400",
    border: "group-hover:border-sky-400/60 dark:group-hover:border-sky-500/50",
    glow: "group-hover:shadow-sky-500/10",
    iconBg: "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sky-500/30",
  },
  lawyers: {
    bg: "from-amber-700/10 to-stone-700/10 dark:from-amber-700/20 dark:to-stone-700/20",
    text: "text-amber-800 dark:text-amber-400",
    border: "group-hover:border-amber-600/60 dark:group-hover:border-amber-500/50",
    glow: "group-hover:shadow-amber-700/10",
    iconBg: "bg-gradient-to-br from-amber-700 to-stone-800 text-white shadow-amber-700/30",
  },
  gamers: {
    bg: "from-purple-600/10 to-indigo-600/10 dark:from-purple-600/20 dark:to-indigo-600/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "group-hover:border-purple-500/60 dark:group-hover:border-purple-500/50",
    glow: "group-hover:shadow-purple-600/10",
    iconBg: "bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-purple-600/30",
  },
  comedians: {
    bg: "from-yellow-500/10 to-amber-500/10 dark:from-yellow-500/20 dark:to-amber-500/20",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "group-hover:border-yellow-400/60 dark:group-hover:border-yellow-500/50",
    glow: "group-hover:shadow-yellow-500/10",
    iconBg: "bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-yellow-500/30",
  },
  "tv-hosts": {
    bg: "from-blue-600/10 to-cyan-600/10 dark:from-blue-600/20 dark:to-cyan-600/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "group-hover:border-blue-400/60 dark:group-hover:border-blue-500/50",
    glow: "group-hover:shadow-blue-600/10",
    iconBg: "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-blue-600/30",
  },
  inventors: {
    bg: "from-amber-500/10 to-yellow-500/10 dark:from-amber-500/20 dark:to-yellow-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "group-hover:border-amber-400/60 dark:group-hover:border-amber-500/50",
    glow: "group-hover:shadow-amber-500/10",
    iconBg: "bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 shadow-amber-500/30",
  },
  economists: {
    bg: "from-emerald-600/10 to-teal-600/10 dark:from-emerald-600/20 dark:to-teal-600/20",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "group-hover:border-emerald-500/60 dark:group-hover:border-emerald-500/50",
    glow: "group-hover:shadow-emerald-600/10",
    iconBg: "bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-emerald-600/30",
  },
  architects: {
    bg: "from-sky-600/10 to-indigo-600/10 dark:from-sky-600/20 dark:to-indigo-600/20",
    text: "text-sky-600 dark:text-sky-400",
    border: "group-hover:border-sky-400/60 dark:group-hover:border-sky-500/50",
    glow: "group-hover:shadow-sky-600/10",
    iconBg: "bg-gradient-to-br from-sky-600 to-indigo-700 text-white shadow-sky-600/30",
  },
};

export default function CategoryIcon({ name, categorySlug, className = "w-6 h-6" }: Props) {
  const IconComponent = iconComponentMap[name] || Folder;
  return <IconComponent className={className} />;
}
