import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
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
    sitemap: "https://profilebook.org/sitemap.xml",
  };
}
