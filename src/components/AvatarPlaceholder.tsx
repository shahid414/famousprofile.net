"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Props {
  name: string;
  image?: string;
  imageCredit?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function AvatarPlaceholder({
  name,
  image,
  imageCredit,
  size = "md",
  className = "",
}: Props) {
  const [hasError, setHasError] = useState(false);

  const getInitials = (fullName: string) => {
    const parts = fullName.replace(/\(.*?\)/g, "").trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-16 h-16 text-lg",
    lg: "w-24 h-24 text-2xl",
    xl: "w-36 h-36 md:w-44 md:h-44 text-4xl",
  };

  const isCustomImage =
    Boolean(image) &&
    image!.trim() !== "" &&
    image !== "/avatars/placeholder.svg" &&
    !image!.endsWith("placeholder.svg") &&
    !hasError;

  return (
    <div className="relative group inline-block">
      <div
        className={`rounded-2xl flex items-center justify-center font-bold tracking-wider select-none shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 transition-transform duration-200 ${sizeClasses[size]} ${className}`}
      >
        {isCustomImage ? (
          <Image
            src={image!}
            alt={name}
            width={size === "xl" ? 240 : size === "lg" ? 128 : 80}
            height={size === "xl" ? 240 : size === "lg" ? 128 : 80}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            priority={size === "xl"}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 text-white font-semibold shadow-inner">
            <span>{getInitials(name)}</span>
          </div>
        )}
      </div>

      {imageCredit && (
        <span className="sr-only">Image credit: {imageCredit}</span>
      )}
    </div>
  );
}
