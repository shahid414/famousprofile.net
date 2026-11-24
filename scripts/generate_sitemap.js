const fs = require("fs");
const path = require("path");

const baseUrl = "https://famousprofile-net.vercel.app";
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

function countryToSlug(country) {
  return country
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// 1. Static Pages
const staticPages = [
  { path: "", priority: "1.0", changefreq: "daily" },
  { path: "/people", priority: "0.9", changefreq: "daily" },
  { path: "/countries", priority: "0.8", changefreq: "weekly" },
  { path: "/about", priority: "0.6", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/editorial-policy", priority: "0.6", changefreq: "monthly" },
  { path: "/attribution-policy", priority: "0.6", changefreq: "monthly" },
  { path: "/privacy-policy", priority: "0.4", changefreq: "yearly" },
  { path: "/disclaimer", priority: "0.4", changefreq: "yearly" },
];

// 2. Categories
const categoriesPath = path.join(__dirname, "../data/categories.json");
const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));

// 3. Profiles
const profilesDir = path.join(__dirname, "../data/profiles");
const profileFiles = fs.readdirSync(profilesDir).filter((f) => f.endsWith(".json"));

const profiles = [];
const countrySet = new Set();

profileFiles.forEach((file) => {
  const list = JSON.parse(fs.readFileSync(path.join(profilesDir, file), "utf8"));
  list.forEach((p) => {
    profiles.push(p);
    if (p.country) {
      countrySet.add(p.country.trim());
    }
  });
});

// 4. Countries
const countries = Array.from(countrySet).sort();

// Build XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add static pages
staticPages.forEach((p) => {
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}${p.path}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
  xml += `    <priority>${p.priority}</priority>\n`;
  xml += `  </url>\n`;
});

// Add category pages
categories.forEach((cat) => {
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/category/${cat.slug}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n`;
});

// Add profile pages
profiles.forEach((p) => {
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/people/${p.slug}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;
});

// Add country pages
countries.forEach((country) => {
  const slug = countryToSlug(country);
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/countries/${slug}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.7</priority>\n`;
  xml += `  </url>\n`;
});

xml += `</urlset>\n`;

const outputPath = path.join(__dirname, "../public/sitemap.xml");
fs.writeFileSync(outputPath, xml, "utf8");

const totalUrls = staticPages.length + categories.length + profiles.length + countries.length;
console.log(`Successfully generated sitemap.xml with ${totalUrls} URLs:`);
console.log(`- Static pages: ${staticPages.length}`);
console.log(`- Categories: ${categories.length}`);
console.log(`- Profiles: ${profiles.length}`);
console.log(`- Countries: ${countries.length}`);
