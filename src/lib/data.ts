import fs from "fs";
import path from "path";
import { Category, Profile } from "@/types";

const dataDir = path.join(process.cwd(), "data");
const categoriesFile = path.join(dataDir, "categories.json");
const profilesDir = path.join(dataDir, "profiles");

// High-speed in-memory cache for sub-millisecond lookups and zero-disk TTFB
let cachedCategories: Category[] | null = null;
let cachedProfiles: Profile[] | null = null;
let cachedCategoryProfiles: Map<string, Profile[]> = new Map();
let lastCacheTimestamp = 0;
const IS_PROD = process.env.NODE_ENV === "production";
const CACHE_TTL_MS = IS_PROD ? 10 * 60 * 1000 : 30 * 1000; // 10 minutes in production, 30s in dev

function shouldRefreshCache(): boolean {
  return !cachedProfiles || Date.now() - lastCacheTimestamp > CACHE_TTL_MS;
}

export function clearDataCache(): void {
  cachedCategories = null;
  cachedProfiles = null;
  cachedCategoryProfiles.clear();
  lastCacheTimestamp = 0;
}

/**
 * Returns all categories from categories.json
 */
export function getAllCategories(): Category[] {
  if (cachedCategories && !shouldRefreshCache()) {
    return cachedCategories;
  }
  try {
    if (!fs.existsSync(categoriesFile)) return [];
    const content = fs.readFileSync(categoriesFile, "utf-8");
    cachedCategories = JSON.parse(content) as Category[];
    return cachedCategories;
  } catch (error) {
    console.error("Failed to read categories:", error);
    return cachedCategories || [];
  }
}

/**
 * Returns a single category by slug
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  const categories = getAllCategories();
  const direct = categories.find((c) => c.slug === slug);
  if (direct) return direct;
  // Handle singular vs plural slugs gracefully (e.g. 'doctor' -> 'doctors', 'actor' -> 'actors', etc.)
  const normalized = slug.toLowerCase();
  return categories.find(
    (c) =>
      c.slug.toLowerCase() === normalized ||
      c.slug.toLowerCase() === `${normalized}s` ||
      `${c.slug.toLowerCase()}s` === normalized
  );
}

/**
 * Returns all profiles across all category JSON files
 */
export function getAllProfiles(): Profile[] {
  if (cachedProfiles && !shouldRefreshCache()) {
    return cachedProfiles;
  }
  try {
    if (!fs.existsSync(profilesDir)) return [];
    const files = fs.readdirSync(profilesDir).filter((f) => f.endsWith(".json"));
    const profiles: Profile[] = [];
    const catMap = new Map<string, Profile[]>();

    for (const file of files) {
      const filePath = path.join(profilesDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const list = JSON.parse(content) as Profile[];
      const catSlug = file.replace(".json", "");
      catMap.set(catSlug, list);
      profiles.push(...list);
    }

    cachedProfiles = profiles;
    cachedCategoryProfiles = catMap;
    lastCacheTimestamp = Date.now();
    return profiles;
  } catch (error) {
    console.error("Failed to read profiles:", error);
    return cachedProfiles || [];
  }
}

/**
 * Returns all profiles belonging to a specific category slug
 */
export function getProfilesByCategory(categorySlug: string): Profile[] {
  if (cachedCategoryProfiles.has(categorySlug) && !shouldRefreshCache()) {
    return cachedCategoryProfiles.get(categorySlug) || [];
  }
  const filePath = path.join(profilesDir, `${categorySlug}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const list = JSON.parse(content) as Profile[];
    cachedCategoryProfiles.set(categorySlug, list);
    return list;
  } catch (error) {
    console.error(`Failed to read category profiles for ${categorySlug}:`, error);
    return [];
  }
}

/**
 * Returns a single profile by slug
 */
export function getProfileBySlug(slug: string): Profile | undefined {
  const all = getAllProfiles();
  return all.find((p) => p.slug === slug);
}

/**
 * Returns featured profiles for home page
 */
export function getFeaturedProfiles(limit = 6): Profile[] {
  const all = getAllProfiles();
  // Deterministic featured list from iconic worldwide figures
  const featuredSlugs = [
    "leonardo-dicaprio",
    "lionel-messi",
    "albert-einstein",
    "steve-jobs",
    "taylor-swift",
    "nelson-mandela",
    "elon-musk",
    "muhammad-ali",
  ];

  const featured = featuredSlugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is Profile => p !== undefined);

  if (featured.length >= limit) return featured.slice(0, limit);
  return all.slice(0, limit);
}

/**
 * Returns latest added profiles
 */
export function getLatestProfiles(limit = 6): Profile[] {
  const all = getAllProfiles();
  // Return the last profiles in reverse
  return [...all].reverse().slice(0, limit);
}

/**
 * Normalizes a country name into a URL-friendly slug
 */
export function countryToSlug(country: string): string {
  return country
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns aggregated country statistics
 */
export function getAllCountries(): { country: string; slug: string; count: number }[] {
  const all = getAllProfiles();
  const map = new Map<string, number>();

  for (const p of all) {
    if (!p.country) continue;
    const count = map.get(p.country) || 0;
    map.set(p.country, count + 1);
  }

  const countries = Array.from(map.entries()).map(([country, count]) => ({
    country,
    slug: countryToSlug(country),
    count,
  }));

  // Sort alphabetically
  return countries.sort((a, b) => a.country.localeCompare(b.country));
}

/**
 * Returns all profiles for a given country slug
 */
export function getProfilesByCountry(countrySlug: string): Profile[] {
  const all = getAllProfiles();
  return all.filter((p) => countryToSlug(p.country) === countrySlug);
}

/**
 * Finds full profile objects for given related slugs
 */
export function getRelatedProfiles(relatedSlugs: string[] = []): Profile[] {
  if (!relatedSlugs.length) return [];
  const all = getAllProfiles();
  return relatedSlugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is Profile => p !== undefined);
}

