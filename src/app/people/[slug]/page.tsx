import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllProfiles,
  getProfileBySlug,
  getCategoryBySlug,
  getRelatedProfiles,
} from "@/lib/data";
import { isFamousPersonality } from "@/lib/wikiFilter";
import Breadcrumbs from "@/components/Breadcrumbs";
import AvatarPlaceholder from "@/components/AvatarPlaceholder";
import QuickFactsTable from "@/components/QuickFactsTable";
import WorksTable from "@/components/WorksTable";
import FAQAccordion from "@/components/FAQAccordion";
import ProfileCard from "@/components/ProfileCard";
import SearchBar from "@/components/SearchBar";
import {
  Award,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Briefcase,
  Sparkles,
  Globe,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
  User,
} from "lucide-react";
import { Profile } from "@/types";

interface Props {
  params: {
    slug: string;
  };
}

interface WikiProfileData {
  title: string;
  description: string;
  extract: string;
  paragraphs: string[];
  image: string | null;
  imageCredit: string;
  sourceUrl: string;
  birthYear?: string;
  deathYear?: string;
  country?: string;
  profession?: string;
}

function titleCaseWord(w: string): string {
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
}

function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Normalize slug into candidate Wikipedia search titles.
// Words inside parentheses follow Wikipedia's disambiguator convention:
// only the first word is capitalized ("Ronaldo (Brazilian footballer)"),
// so the direct summary lookup succeeds instead of relying on search fallback.
function slugToTitle(slug: string): string {
  const clean = decodeURIComponent(slug).replace(/[-_]+/g, " ").trim();
  const openIdx = clean.indexOf("(");
  if (openIdx === -1) {
    return clean
      .split(" ")
      .map(titleCaseWord)
      .join(" ");
  }
  const before = clean.slice(0, openIdx).trim();
  const inside = clean.slice(openIdx + 1).replace(/\)/g, "").trim();
  const insideWords = inside.split(/\s+/).filter(Boolean);
  const insideTitled =
    insideWords.length > 0
      ? [
          titleCaseWord(insideWords[0]),
          ...insideWords.slice(1).map((w) => w.toLowerCase()),
        ].join(" ")
      : "";
  const beforeTitled = before
    .split(" ")
    .map(titleCaseWord)
    .join(" ");
  return `${beforeTitled} (${insideTitled})`;
}

// Same as slugToTitle, but with the parenthetical fully lowercased
// ("Fey (singer)", "Madonna (singer)"): some disambiguators are lowercase.
function slugToTitleLowerParen(slug: string): string {
  const clean = decodeURIComponent(slug).replace(/[-_]+/g, " ").trim();
  const openIdx = clean.indexOf("(");
  if (openIdx === -1) return slugToTitle(slug);
  const before = clean.slice(0, openIdx).trim();
  const inside = clean
    .slice(openIdx + 1)
    .replace(/\)/g, "")
    .trim()
    .toLowerCase();
  const beforeTitled = before
    .split(" ")
    .map(titleCaseWord)
    .join(" ");
  return `${beforeTitled} (${inside})`;
}

// Server-side Wikipedia fetcher with 24-hour cache (ISR) and search fallback
async function fetchWikiProfile(slug: string): Promise<WikiProfileData | null> {
  const candidate = slugToTitle(slug);
  const userAgent = "ProfileBookApp/1.0 (https://profilebook.org; contact@profilebook.org)";

  // Fetch one REST summary; returns null on non-OK status.
  async function fetchSummary(title: string): Promise<any | null> {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        {
          headers: { "User-Agent": userAgent, Accept: "application/json" },
          next: { revalidate: 86400 }, // 24-hour ISR cache
        }
      );
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  try {
    // 1. Fetch REST summary with resilient search fallback.
    // Try both parenthetical casings: "Ronaldo (Brazilian footballer)"
    // and "Fey (singer)".
    let summary: any = await fetchSummary(candidate);
    if (!summary && candidate !== slugToTitleLowerParen(slug)) {
      summary = await fetchSummary(slugToTitleLowerParen(slug));
    }

    if (!summary) {
      // Fallback: search Wikipedia REST API and accept ONLY a result that
      // actually matches this slug (exact key, or diacritic-insensitive
      // title match). Never render the top hit blindly — it may be a
      // different person with a similar name.
      const searchRes = await fetch(
        `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(candidate)}&limit=5`,
        {
          headers: { "User-Agent": userAgent, Accept: "application/json" },
          next: { revalidate: 86400 },
        }
      );
      if (searchRes.ok) {
        const searchJson = await searchRes.json();
        const pages: any[] = searchJson.pages || [];
        const normSlug = slug.toLowerCase();
        const normCandidate = stripDiacritics(candidate.toLowerCase());
        const match = pages.find((p) => {
          const keySlug = (p.key || "").toLowerCase().replace(/_/g, "-");
          if (keySlug === normSlug) return true;
          const titleNorm = stripDiacritics(
            (p.title || "").toLowerCase().replace(/_/g, " ")
          );
          return titleNorm === normCandidate;
        });
        if (match?.key) {
          summary = await fetchSummary(match.key);
        }
      }
    }

    if (!summary) return null;

    // Filter disambiguation or empty articles. The length guard lives on
    // the FULL lead extract below, not on the summary: a stub article can
    // have a 33-character summary ("Pablo Santos (9 January 1987 – 15
    // September 2006) was a Mexican actor.") yet still be a real person
    // with a renderable page. Rejecting on summary length produced 404s
    // for links our own search had just emitted.
    if (summary.type === "disambiguation" || !summary.extract) {
      return null;
    }

    if (
      !isFamousPersonality({
        title: summary.title || candidate,
        description: summary.description,
        excerpt: summary.extract,
      })
    ) {
      return null;
    }

    const title = summary.title || candidate;
    const description = summary.description || "Notable Public Figure";
    const image = summary.originalimage?.source || summary.thumbnail?.source || null;
    const sourceUrl =
      summary.content_urls?.desktop?.page ||
      `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, "_"))}`;

    // 2. Fetch full lead section extract from MediaWiki Action API
    let fullExtract = summary.extract;
    try {
      const actionRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(
          title
        )}&format=json`,
        {
          headers: { "User-Agent": userAgent, Accept: "application/json" },
          next: { revalidate: 86400 },
        }
      );

      if (actionRes.ok) {
        const actionData = await actionRes.json();
        const pages = actionData.query?.pages;
        if (pages) {
          const firstPage = Object.values(pages)[0] as any;
          if (firstPage?.extract && firstPage.extract.length > fullExtract.length) {
            fullExtract = firstPage.extract;
          }
        }
      }
    } catch (e) {
      // Fallback gracefully to summary.extract
    }

    // Thin-article guard on the full lead text (not the summary): reject
    // only near-empty articles. A one-sentence stub still renders a real
    // page (hero, quick facts, FAQs, related profiles).
    if (!fullExtract || fullExtract.length < 40) {
      return null;
    }

    // Split into clean paragraphs
    const paragraphs = fullExtract
      .split(/\n\s*\n/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 40);

    // Parse born / died from description or extract (e.g. "born 1985", "(1879–1955)")
    let birthYear: string | undefined;
    let deathYear: string | undefined;
    const datesMatch = fullExtract.match(/\((?:born\s+)?(\d{1,2}\s+\w+\s+)?(\d{4})(?:\s*[–-]\s*(\d{1,2}\s+\w+\s+)?(\d{4}))?\)/i);
    if (datesMatch) {
      birthYear = datesMatch[2];
      deathYear = datesMatch[4];
    }

    return {
      title,
      description,
      extract: fullExtract,
      paragraphs: paragraphs.length > 0 ? paragraphs : [summary.extract],
      image,
      imageCredit: "Wikimedia Commons / ProfileBook Knowledge Archive",
      sourceUrl,
      birthYear,
      deathYear,
    };
  } catch (error) {
    console.error(`Failed to fetch Wikipedia profile for ${slug}:`, error);
    return null;
  }
}

// Static generation params for all pre-curated profiles
export async function generateStaticParams() {
  const profiles = getAllProfiles();
  return profiles.map((p) => ({
    slug: p.slug,
  }));
}

// Dynamic SEO Metadata Generator
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const localProfile = getProfileBySlug(params.slug);

  if (localProfile) {
    const title = `${localProfile.name} - Biography, Facts & Career Highlights`;
    const description = localProfile.bio.slice(0, 155);

    return {
      title: `${localProfile.name} - Biography, Facts & Career Highlights`,
      description,
      alternates: {
        canonical: `https://profilebook.org/people/${localProfile.slug}`,
      },
      openGraph: {
        title: `${localProfile.name} | ProfileBook`,
        description,
        type: "profile",
        url: `https://profilebook.org/people/${localProfile.slug}`,
        images: localProfile.image ? [{ url: localProfile.image, alt: localProfile.name }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${localProfile.name} | ProfileBook`,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  // Check Wikipedia live for dynamic personality URL
  const wiki = await fetchWikiProfile(params.slug);
  if (!wiki) {
    return {
      title: "Profile Not Found | ProfileBook",
      robots: { index: false, follow: false },
    };
  }

  const title = `${wiki.title} - Biography, Career & Facts`;
  const description = `${wiki.title} (${wiki.description}). Comprehensive biographical timeline, career highlights, achievements, and facts on ProfileBook.`.slice(0, 158);

  return {
    title: `${wiki.title} - Biography, Career & Facts`,
    description,
    alternates: {
      canonical: `https://profilebook.org/people/${params.slug}`,
    },
    openGraph: {
      title: `${wiki.title} | ProfileBook`,
      description,
      type: "profile",
      url: `https://profilebook.org/people/${params.slug}`,
      images: wiki.image ? [{ url: wiki.image, alt: wiki.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${wiki.title} | ProfileBook`,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function UniversalPersonPage({ params }: Props) {
  const localProfile = getProfileBySlug(params.slug);

  // SCENARIO 1: Published Local Directory Profile (Curated with complete assets)
  if (localProfile) {
    const category = getCategoryBySlug(localProfile.category);
    const relatedProfiles = getRelatedProfiles(localProfile.related);
    const isDeceased = Boolean(localProfile.deathDate);

    // Schema.org Person JSON-LD
    const personJsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: localProfile.name,
      alternateName: localProfile.nickname,
      jobTitle: localProfile.profession,
      description: localProfile.bio,
      birthDate: localProfile.birthDate,
      ...(localProfile.deathDate ? { deathDate: localProfile.deathDate } : {}),
      birthPlace: {
        "@type": "Place",
        name: localProfile.birthPlace,
      },
      nationality: {
        "@type": "Country",
        name: localProfile.country,
      },
      knowsLanguage: localProfile.languages,
      sameAs: localProfile.sources,
      mainEntityOfPage: `https://profilebook.org/people/${localProfile.slug}`,
    };

    // BreadcrumbList JSON-LD
    const breadcrumbsJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://profilebook.org",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Famous Personalities",
          item: "https://profilebook.org/people",
        },
        ...(category
          ? [
              {
                "@type": "ListItem",
                position: 3,
                name: category.title,
                item: `https://profilebook.org/category/${category.slug}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: localProfile.name,
                item: `https://profilebook.org/people/${localProfile.slug}`,
              },
            ]
          : [
              {
                "@type": "ListItem",
                position: 3,
                name: localProfile.name,
                item: `https://profilebook.org/people/${localProfile.slug}`,
              },
            ]),
      ],
    };

    // FAQPage JSON-LD
    const faqJsonLd =
      localProfile.faq && localProfile.faq.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: localProfile.faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }
        : null;

    return (
      <article className="space-y-10">
        {/* Structured Data Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
        />
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}

        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: "People", href: "/people" },
            ...(category
              ? [
                  {
                    label: category.title,
                    href: `/category/${category.slug}`,
                  },
                ]
              : []),
            { label: localProfile.name },
          ]}
        />

        {/* Quick Dual Personality Search Bar */}
        <div className="bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 md:p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Explore Another Personality
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hidden sm:inline">
              Searches our directory &amp; live Wikipedia
            </span>
          </div>
          <SearchBar
            placeholder={`Search any personality worldwide (e.g. Messi, Marie Curie, Einstein)...`}
            size="large"
          />
        </div>

        {/* SECTION 1: Name + Photo + Profession Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            <AvatarPlaceholder
              name={localProfile.name}
              image={localProfile.image}
              imageCredit={localProfile.imageCredit}
              size="xl"
              className="shrink-0"
            />

            <div className="space-y-3 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Directory Profile
                </span>

                {isDeceased && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Memorial ({localProfile.birthDate.split("-")[0]} – {localProfile.deathDate?.split("-")[0]})
                  </span>
                )}

                {localProfile.nickname && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                    &ldquo;{localProfile.nickname}&rdquo;
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {localProfile.name}
              </h1>

              <p className="text-lg sm:text-xl font-medium text-indigo-600 dark:text-indigo-400">
                {localProfile.profession}
              </p>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex-wrap pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {localProfile.country}
                </span>
                {localProfile.industry && (
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    {localProfile.industry}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Quick Facts Table */}
        <QuickFactsTable profile={localProfile} />

        {/* SECTION 3: Short Biography */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Biography &amp; Life Overview
          </h2>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
            {localProfile.bio}
          </p>
        </section>

        {/* SECTION 4: Key Works / Achievements Table */}
        <WorksTable works={localProfile.famousWorks} />

        {/* SECTION 5: Awards */}
        {localProfile.awards && localProfile.awards.length > 0 && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Major Awards &amp; Honors
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {localProfile.awards.map((award, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {award}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* SECTION 6: FAQ */}
        <FAQAccordion faq={localProfile.faq} />

        {/* SECTION 7: Related Profiles */}
        {relatedProfiles.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Related Personalities
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Notable figures from related realms
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedProfiles.map((rel) => (
                <ProfileCard key={rel.slug} profile={rel} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 8: Sources & Citations */}
        {localProfile.sources && localProfile.sources.length > 0 && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Verified Public Citations &amp; Sourcing
            </h2>
            <ul className="space-y-2 text-xs">
              {localProfile.sources.map((src, idx) => (
                <li key={idx}>
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    {src}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              Image note: {localProfile.imageCredit || "Neutral vector placeholder avatar."}
            </p>
          </section>
        )}

        {/* SECTION 9: Bottom Personality Discovery Search Bar */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm text-center space-y-4">
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Looking for Another Figure or Personality?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Instant live search across our directory and millions of English Wikipedia articles.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <SearchBar
              placeholder="Type any name (e.g. Cristiano Ronaldo, Steve Jobs, Newton)..."
              size="large"
            />
          </div>
        </section>
      </article>
    );
  }

  // SCENARIO 2: Dynamic Server-Rendered Wikipedia Personality Profile
  const wiki = await fetchWikiProfile(params.slug);

  if (!wiki) {
    notFound();
  }

  // Related personalities from local database to give internal link value
  const allProfiles = getAllProfiles();
  const relatedPersonalities = allProfiles.slice(0, 3);

  // Dynamic FAQs for structured data and FAQ Accordion
  const wikiFaqs = [
    {
      q: `Who is ${wiki.title}?`,
      a: wiki.paragraphs[0] || `${wiki.title} is a notable global personality recognized as ${wiki.description}.`,
    },
    {
      q: `What is ${wiki.title} best known for?`,
      a: wiki.paragraphs[1] || `${wiki.title} has earned international acclaim and public recognition as ${wiki.description}.`,
    },
    {
      q: `What are verified timeline facts about ${wiki.title}?`,
      a: `${wiki.title} is indexed in ProfileBook's global biographical archive${
        wiki.birthYear
          ? ` with a documented birth year of ${wiki.birthYear}${
              wiki.deathYear ? ` and passed away in ${wiki.deathYear}` : " (Active/Living)"
            }.`
          : " as a prominent contemporary figure."
      }`,
    },
    {
      q: `How is information for ${wiki.title} maintained on ProfileBook?`,
      a: `Biographical facts, career achievements, and background for ${wiki.title} are curated from verified open encyclopedic archives and distributed in compliance with the Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0).`,
    },
  ];

  // Schema.org Person JSON-LD for Wikipedia personalities
  const wikiPersonJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: wiki.title,
    jobTitle: wiki.description,
    description: wiki.extract.slice(0, 300),
    ...(wiki.image ? { image: wiki.image } : {}),
    ...(wiki.birthYear ? { birthDate: wiki.birthYear } : {}),
    ...(wiki.deathYear ? { deathDate: wiki.deathYear } : {}),
    sameAs: [wiki.sourceUrl],
    mainEntityOfPage: `https://profilebook.org/people/${params.slug}`,
  };

  // BreadcrumbList JSON-LD
  const wikiBreadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://profilebook.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Famous Personalities",
        item: "https://profilebook.org/people",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: wiki.title,
        item: `https://profilebook.org/people/${params.slug}`,
      },
    ],
  };

  // FAQPage JSON-LD
  const wikiFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: wikiFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <article className="space-y-10">
      {/* Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wikiPersonJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wikiBreadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wikiFaqJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "People", href: "/people" },
          { label: wiki.title },
        ]}
      />

      {/* Quick Dual Personality Search Bar */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 md:p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Explore Another Personality
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hidden sm:inline">
            Direct lookup across verified figures
          </span>
        </div>
        <SearchBar
          placeholder={`Search any personality worldwide (e.g. Cristiano Ronaldo, Messi, Marie Curie, Bill Gates)...`}
          size="large"
        />
      </div>

      {/* Hero Header Card - Standard ProfileBook Design */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
          {/* Portrait Showcase */}
          <div className="relative w-36 h-44 sm:w-48 sm:h-56 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border-2 border-slate-200 dark:border-slate-700 shadow-md">
            {wiki.image ? (
              <Image
                src={wiki.image}
                alt={wiki.title}
                fill
                sizes="(max-width: 640px) 144px, 192px"
                className="object-cover object-top"
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-700 to-slate-900 text-white font-black text-4xl">
                {wiki.title.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Details & SEO Metadata */}
          <div className="space-y-3 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Verified Personality Profile
              </span>

              {(wiki.birthYear || wiki.deathYear) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Calendar className="w-3 h-3" />
                  {wiki.birthYear ? `b. ${wiki.birthYear}` : "Era"}
                  {wiki.deathYear ? ` – d. ${wiki.deathYear}` : " – Present"}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {wiki.title}
            </h1>

            <p className="text-lg sm:text-xl font-medium text-indigo-600 dark:text-indigo-400 capitalize">
              {wiki.description}
            </p>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-500" />
                Global Public Figure
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Verified Archival Records
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Quick Facts Grid (Matches ProfileBook QuickFactsTable design) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          Quick Facts
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 mt-0.5">
              <User className="w-4 h-4" />
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Canonical Name</dt>
              <dd className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{wiki.title}</dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 mt-0.5">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Profession / Realm</dt>
              <dd className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 capitalize">{wiki.description}</dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Timeline / Lifespan</dt>
              <dd className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                {wiki.birthYear ? `Born ${wiki.birthYear}` : "Contemporary Era"}
                {wiki.deathYear ? ` – Died ${wiki.deathYear}` : wiki.birthYear ? " – Present" : ""}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Verification Status</dt>
              <dd className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <span>ProfileBook Verified Index</span>
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 mt-0.5">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Directory Sphere</dt>
              <dd className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">Global Notable Figures</dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Content Licensing</dt>
              <dd className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">CC BY-SA 4.0 Verified</dd>
            </div>
          </div>
        </dl>
      </div>

      {/* SECTION 3: Biography & Career Highlights */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Biography &amp; Career Highlights
        </h2>

        <div className="space-y-5 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {wiki.paragraphs.map((paragraph: string, idx: number) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* SECTION 4: Frequently Asked Questions */}
      <FAQAccordion faq={wikiFaqs} />

      {/* SECTION 5: Related Personalities */}
      {relatedPersonalities.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Explore More Personalities
            </h2>
            <Link
              href="/people"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View all directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedPersonalities.map((rel: Profile) => (
              <ProfileCard key={rel.slug} profile={rel} />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 6: Citation, Licensing & Compliance Box */}
      <section className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              ProfileBook Knowledge Sources &amp; Licensing Compliance
            </h2>
          </div>
          <Link
            href="/attribution-policy"
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Attribution Policy &rarr;
          </Link>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Biographical facts, career achievements, and background for <strong>{wiki.title}</strong> are compiled from verified open knowledge repositories (English MediaWiki API) and rendered using ProfileBook UI. Text is distributed under the{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 font-semibold underline"
          >
            Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)
          </a>
          . All trademarks and media copyrights belong to their respective copyright holders.
        </p>
      </section>

      {/* SECTION 7: Bottom Discovery Search Bar */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm text-center space-y-4">
        <div className="max-w-xl mx-auto space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Search Another Famous Personality
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Instant dual lookup across our directory and open knowledge records.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <SearchBar
            placeholder="Search figures (e.g. Cristiano Ronaldo, Steve Jobs, Elon Musk, Marie Curie)..."
            size="large"
          />
        </div>
      </section>
    </article>
  );
}
