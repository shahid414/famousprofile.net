import React from "react";
import Image from "next/image";

interface Props {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className = "" }: Props) {
  // Height presets for the full logo
  const sizeMap = {
    sm: "h-8 sm:h-9",
    md: "h-11 sm:h-12",
    lg: "h-14 sm:h-16",
  };

  // Square presets for just the emblem mark
  const markSizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  if (!showText) {
    return (
      <div className={`relative ${markSizeMap[size]} shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}>
        <Image
          src="/logo-mark.png"
          alt="ProfileBook Emblem"
          width={120}
          height={120}
          className="w-full h-full object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <div className={`relative ${sizeMap[size]} flex items-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}>
      {/* Light Mode Logo */}
      <Image
        src="/logo.png"
        alt="ProfileBook - Discover • Explore • Learn"
        width={300}
        height={209}
        sizes="(max-width: 640px) 160px, 240px"
        className="dark:hidden h-full w-auto object-contain"
        priority
      />

      {/* Dark Mode Logo (High Contrast) */}
      <Image
        src="/logo-dark.png"
        alt="ProfileBook - Discover • Explore • Learn"
        width={300}
        height={209}
        sizes="(max-width: 640px) 160px, 240px"
        className="hidden dark:block h-full w-auto object-contain"
        priority
      />
    </div>
  );
}
