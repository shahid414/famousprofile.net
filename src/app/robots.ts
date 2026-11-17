import { MetadataRoute } from "next";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://famousprofile-net.vercel.app";
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/people",
          "/people/*",
          "/category/*",
          "/countries/*",
          "/about",
          "/contact",
          "/editorial-policy",
          "/attribution-policy",
          "/privacy-policy",
          "/disclaimer",
        ],
        disallow: [
          "/api/*",
          "/search",
          "/search/*",
          "/wiki-search",
          "/wiki-search/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
