# ProfileBook 📖

A modern, fast, production-ready profile directory website showcasing iconic figures, world leaders, athletes, artists, and innovators worldwide.

Built with **Next.js (App Router)**, **Tailwind CSS**, static generation (`generateStaticParams`), and **zero external database dependencies**. All data is automatically indexed from lightweight JSON files.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📂 Architecture & Data Structure

All content is statically driven by JSON files located in the `/data` folder:

```
data/
├── categories.json               # Master list of all 25 categories
└── profiles/
    ├── actors.json
    ├── singers.json
    ├── cricketers.json
    ├── footballers.json
    └── ... (one JSON file per category)
```

Adding or editing profiles does **not** require database migrations or code changes. Next.js automatically generates the pages, search index, country directories, and `sitemap.xml` directly from these files at build time.

---

## ✍️ How to Add a New Profile

To add a new person to any existing category:

1. Open `/data/profiles/<category-slug>.json` (for example, `/data/profiles/actors.json`).
2. Add a new JSON object adhering strictly to the schema below:

```json
{
  "slug": "cillian-murphy",
  "name": "Cillian Murphy",
  "category": "actors",
  "profession": "Actor",
  "industry": "Hollywood & Theater",
  "country": "Ireland",
  "birthDate": "1976-05-25",
  "deathDate": null,
  "birthPlace": "Douglas, Cork, Ireland",
  "languages": ["English", "Irish"],
  "nickname": "Cillian",
  "bio": "Cillian Murphy is an Irish actor celebrated for his intense, chameleon-like performances across film, television, and theater. He garnered international praise for starring in Peaky Blinders as Thomas Shelby and collaborating extensively with director Christopher Nolan. In 2024, Murphy won the Academy Award for Best Actor for his portrayal of J. Robert Oppenheimer.",
  "famousWorks": [
    { "year": 2002, "title": "28 Days Later" },
    { "year": 2013, "title": "Peaky Blinders (as Thomas Shelby)" },
    { "year": 2023, "title": "Oppenheimer" }
  ],
  "awards": [
    "Academy Award for Best Actor (2024)",
    "BAFTA Award for Best Actor in a Leading Role (2024)",
    "Golden Globe Award for Best Actor - Drama (2024)"
  ],
  "faq": [
    {
      "q": "For which role did Cillian Murphy win an Academy Award?",
      "a": "He won the Best Actor Oscar in 2024 for his title performance in Christopher Nolan's Oppenheimer."
    }
  ],
  "related": ["christopher-nolan", "leonardo-dicaprio"],
  "sources": [
    "https://en.wikipedia.org/wiki/Cillian_Murphy"
  ],
  "image": "/avatars/placeholder.svg",
  "imageCredit": "Neutral vector avatar placeholder"
}
```

### Deceased Profiles
If the individual is deceased, populate `"deathDate": "YYYY-MM-DD"`. The UI will automatically:
- Display life span years (e.g. `1879 – 1955`).
- Add a subtle `Deceased` badge.
- Adapt the biographical tone into past tense.

---

## 🏷️ How to Add a New Category

To add a completely new category:

1. **Add to `data/categories.json`**:
```json
{
  "slug": "filmmakers",
  "title": "Famous Filmmakers",
  "seoDescription": "Discover legendary documentary makers, cinematographers, and film visionaries.",
  "icon": "Video"
}
```
*(Icons correspond to Lucide icon names like `Film`, `Mic`, `Trophy`, `Atom`, etc.)*

2. **Create the profile file**:
Create `data/profiles/filmmakers.json` and seed it with profiles:
```json
[
  {
    "slug": "example-filmmaker",
    "name": "Jane Doe",
    "category": "filmmakers",
    ...
  }
]
```

Next time you build or restart `npm run dev`, the new category will automatically:
- Appear on the Home page category grid.
- Gain a dedicated page at `/category/filmmakers` with dynamic filters.
- Include all profiles in global search, country listings, and `sitemap.xml`.

---

## 🌐 Routes Overview

- `/` — Home page with hero search, all 25 categories, featured profiles, latest additions, country pills, and footer.
- `/category/[slug]` — Category view with real-time client-side search, filtering (Country, Industry, Living/Deceased), sorting (A-Z, newest), and pagination.
- `/profile/[slug]` — Detailed profile with photo, Quick Facts table, bio, key works table, awards, FAQ accordion, related profiles, and sources.
- `/search?q=` — Instant search across names, professions, industries, bios, and categories.
- `/countries/[country]` — Geographical directory of profiles by country.
- `/about` — Editorial mission and static architecture.
- `/contact` — Interactive contact form for fact check corrections, suggestions, and removals.
- `/privacy-policy` — Zero-tracking privacy commitment.
- `/disclaimer` — Public source compilation disclaimer and fact correction policy.
- `/sitemap.xml` & `/robots.txt` — Automated SEO generation.

---

## 🚢 Deploying to Vercel

This repository is ready for zero-config deployment on Vercel:

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Import the project in the [Vercel Dashboard](https://vercel.com).
3. Click **Deploy**. Vercel will automatically detect Next.js and execute `npm run build`.

No database, secrets, or environment variables are required.

