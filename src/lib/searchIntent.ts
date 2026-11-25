/**
 * Search intent parsing for ProfileBook smart search.
 *
 * Turns a free-text query into a structured intent so the ranking layer can
 * treat "Famous People from Mexico", "Famous Actors from Mexico",
 * "New Famous People from Mexico", "Historical Famous People" and
 * "Cristiano Ronaldo" differently instead of doing a plain substring match.
 *
 * Pure function: all dataset-derived vocabularies (country list, category
 * list) are passed in by the caller, so this module is trivially unit-testable
 * and never invents a country or profession that is not in the data.
 */

export type SearchKind =
  | "person"
  | "country"
  | "profession"
  | "country+profession"
  | "era"
  | "broad";

export type Era = "new" | "modern" | "historical" | null;

/**
 * Era thresholds — the SINGLE source of truth for every era decision
 * (intent parsing, local scoring, Wikipedia filtering, results-page groups).
 *
 * - "new" (new generation): born 2000 or later, living.
 * - "modern": born 1990 or later, living.
 * - "historical": deceased, or born before 1950.
 *
 * 2000 is used for "new generation" because it is the clean, defensible
 * Gen-Z boundary: anyone born in the 1980s or early 1990s is NOT new.
 * Every code path must use these constants — no hardcoded years elsewhere.
 */
export const NEW_GENERATION_MIN_BIRTH_YEAR = 2000;
export const MODERN_MIN_BIRTH_YEAR = 1990;
export const HISTORICAL_MAX_BIRTH_YEAR = 1950;

/** Display label for each era (used by the results-page intent chips). */
export const ERA_LABELS: Record<Exclude<Era, null>, string> = {
  new: "New Generation",
  modern: "Modern",
  historical: "Historical",
};

export interface SearchIntent {
  kind: SearchKind;
  /** Canonical country name, e.g. "Mexico" (null when no country detected). */
  country: string | null;
  /** Adjective used for Wikipedia queries, e.g. "Mexican". */
  demonym: string | null;
  /** Category slug, e.g. "actors" (null when no profession detected). */
  profession: string | null;
  /** Singular profession word for Wikipedia queries, e.g. "actor". */
  professionWord: string | null;
  /** Synonym words the profession may appear as in a Wikipedia description
   * (e.g. actors -> ["actor","actors","actress","actresses"]); used as a
   * hard profession check for Wikipedia results. Null when no profession. */
  professionSynonyms: string[] | null;
  era: Era;
  /** Leftover tokens that look like a person's name, e.g. "cristiano ronaldo". */
  personQuery: string | null;
  /** Wikipedia search queries derived from the intent (may be empty). */
  wikiQueries: string[];
  /** The raw query, trimmed. */
  rawQuery: string;
}

/** Demonym / alias -> canonical country name. */
const DEMONYMS: Record<string, string> = {
  american: "United States",
  usa: "United States",
  us: "United States",
  "united states": "United States",
  "united states of america": "United States",
  british: "United Kingdom",
  "united kingdom": "United Kingdom",
  uk: "United Kingdom",
  english: "England",
  england: "England",
  indian: "India",
  india: "India",
  pakistani: "Pakistan",
  pakistan: "Pakistan",
  german: "Germany",
  germany: "Germany",
  spanish: "Spain",
  spain: "Spain",
  australian: "Australia",
  australia: "Australia",
  french: "France",
  france: "France",
  brazilian: "Brazil",
  brazil: "Brazil",
  italian: "Italy",
  italy: "Italy",
  "south african": "South Africa",
  "south africa": "South Africa",
  canadian: "Canada",
  canada: "Canada",
  austrian: "Austria",
  austria: "Austria",
  mexican: "Mexico",
  mexico: "Mexico",
  argentine: "Argentina",
  argentinian: "Argentina",
  argentina: "Argentina",
  portuguese: "Portugal",
  portugal: "Portugal",
  dutch: "Netherlands",
  netherlands: "Netherlands",
  russian: "Russia",
  russia: "Russia",
  chinese: "China",
  china: "China",
  japanese: "Japan",
  japan: "Japan",
  korean: "South Korea",
  "south korean": "South Korea",
  "south korea": "South Korea",
  turkish: "Turkey",
  turkey: "Turkey",
  turkiye: "Turkey",
  egyptian: "Egypt",
  egypt: "Egypt",
  nigerian: "Nigeria",
  nigeria: "Nigeria",
  kenyan: "Kenya",
  kenya: "Kenya",
  irish: "Ireland",
  ireland: "Ireland",
  scottish: "Scotland",
  scotland: "Scotland",
  welsh: "Wales",
  wales: "Wales",
  swedish: "Sweden",
  sweden: "Sweden",
  norwegian: "Norway",
  norway: "Norway",
  danish: "Denmark",
  denmark: "Denmark",
  finnish: "Finland",
  finland: "Finland",
  polish: "Poland",
  poland: "Poland",
  greek: "Greece",
  greece: "Greece",
  ukrainian: "Ukraine",
  ukraine: "Ukraine",
  israeli: "Israel",
  israel: "Israel",
  iranian: "Iran",
  iran: "Iran",
  iraqi: "Iraq",
  iraq: "Iraq",
  afghan: "Afghanistan",
  afghanistan: "Afghanistan",
  bangladeshi: "Bangladesh",
  bangladesh: "Bangladesh",
  thai: "Thailand",
  thailand: "Thailand",
  vietnamese: "Vietnam",
  vietnam: "Vietnam",
  indonesian: "Indonesia",
  indonesia: "Indonesia",
  malaysian: "Malaysia",
  malaysia: "Malaysia",
  filipino: "Philippines",
  philippines: "Philippines",
  cuban: "Cuba",
  cuba: "Cuba",
  colombian: "Colombia",
  colombia: "Colombia",
  chilean: "Chile",
  chile: "Chile",
  peruvian: "Peru",
  peru: "Peru",
  venezuelan: "Venezuela",
  venezuela: "Venezuela",
  jamaican: "Jamaica",
  jamaica: "Jamaica",
  swiss: "Switzerland",
  switzerland: "Switzerland",
  belgian: "Belgium",
  belgium: "Belgium",
  hungarian: "Hungary",
  hungary: "Hungary",
  romanian: "Romania",
  romania: "Romania",
  czech: "Czech Republic",
  "czech republic": "Czech Republic",
  croatian: "Croatia",
  croatia: "Croatia",
  serbian: "Serbia",
  serbia: "Serbia",
  bulgarian: "Bulgaria",
  bulgaria: "Bulgaria",
  albanian: "Albania",
  albania: "Albania",
  icelandic: "Iceland",
  iceland: "Iceland",
  "new zealander": "New Zealand",
  "new zealand": "New Zealand",
  "hong kong": "Hong Kong",
  hongkong: "Hong Kong",
  sri: "Sri Lanka",
  "sri lankan": "Sri Lanka",
  "sri lanka": "Sri Lanka",
  nepali: "Nepal",
  nepal: "Nepal",
  // --- Added 2026-11-25 (accuracy audit): demonyms that were missing, so a
  // result's real nationality could not be detected and an incidental
  // mention of another country (e.g. "in Pakistan" in a match report)
  // wrongly became the "first" nationality. E.g. Wes Hall is Barbadian,
  // not Pakistani; Rizq Abu Shaeera is Palestinian, not American.
  barbadian: "Barbados",
  barbados: "Barbados",
  palestinian: "Palestine",
  palestine: "Palestine",
  trinidadian: "Trinidad and Tobago",
  "trinidad and tobago": "Trinidad and Tobago",
  trinidad: "Trinidad and Tobago",
  guyanese: "Guyana",
  guyana: "Guyana",
  grenadian: "Grenada",
  grenada: "Grenada",
  bahamian: "Bahamas",
  bahamas: "Bahamas",
  belizean: "Belize",
  belize: "Belize",
  honduran: "Honduras",
  honduras: "Honduras",
  nicaraguan: "Nicaragua",
  nicaragua: "Nicaragua",
  "costa rican": "Costa Rica",
  "costa rica": "Costa Rica",
  panamanian: "Panama",
  panama: "Panama",
  haitian: "Haiti",
  haiti: "Haiti",
  dominican: "Dominican Republic",
  "dominican republic": "Dominican Republic",
  fijian: "Fiji",
  fiji: "Fiji",
  samoan: "Samoa",
  samoa: "Samoa",
  tongan: "Tonga",
  tonga: "Tonga",
  maltese: "Malta",
  malta: "Malta",
  cypriot: "Cyprus",
  cyprus: "Cyprus",
  mauritian: "Mauritius",
  mauritius: "Mauritius",
  zimbabwean: "Zimbabwe",
  zimbabwe: "Zimbabwe",
  zambian: "Zambia",
  zambia: "Zambia",
  mozambican: "Mozambique",
  mozambique: "Mozambique",
  angolan: "Angola",
  angola: "Angola",
  ghanaian: "Ghana",
  ghana: "Ghana",
  senegalese: "Senegal",
  senegal: "Senegal",
  cameroonian: "Cameroon",
  cameroon: "Cameroon",
  ivorian: "Ivory Coast",
  "ivory coast": "Ivory Coast",
  congolese: "Congo",
  congo: "Congo",
  somali: "Somalia",
  somalia: "Somalia",
  sudanese: "Sudan",
  sudan: "Sudan",
  libyan: "Libya",
  libya: "Libya",
  tunisian: "Tunisia",
  tunisia: "Tunisia",
  algerian: "Algeria",
  algeria: "Algeria",
  moroccan: "Morocco",
  morocco: "Morocco",
  jordanian: "Jordan",
  jordan: "Jordan",
  lebanese: "Lebanon",
  lebanon: "Lebanon",
  syrian: "Syria",
  syria: "Syria",
  yemeni: "Yemen",
  yemen: "Yemen",
  omani: "Oman",
  oman: "Oman",
  qatari: "Qatar",
  qatar: "Qatar",
  kuwaiti: "Kuwait",
  kuwait: "Kuwait",
  bahraini: "Bahrain",
  bahrain: "Bahrain",
  emirati: "United Arab Emirates",
  "united arab emirates": "United Arab Emirates",
  uae: "United Arab Emirates",
  georgian: "Georgia",
  georgia: "Georgia",
  armenian: "Armenia",
  armenia: "Armenia",
  kazakh: "Kazakhstan",
  kazakhstan: "Kazakhstan",
  uzbek: "Uzbekistan",
  uzbekistan: "Uzbekistan",
  kyrgyz: "Kyrgyzstan",
  kyrgyzstan: "Kyrgyzstan",
  tajik: "Tajikistan",
  tajikistan: "Tajikistan",
  turkmen: "Turkmenistan",
  turkmenistan: "Turkmenistan",
  mongolian: "Mongolia",
  mongolia: "Mongolia",
  bhutanese: "Bhutan",
  bhutan: "Bhutan",
  burmese: "Myanmar",
  myanmar: "Myanmar",
  cambodian: "Cambodia",
  cambodia: "Cambodia",
  laotian: "Laos",
  laos: "Laos",
  bruneian: "Brunei",
  brunei: "Brunei",
  maldivian: "Maldives",
  maldives: "Maldives",
  singaporean: "Singapore",
  singapore: "Singapore",
  taiwanese: "Taiwan",
  taiwan: "Taiwan",
  estonian: "Estonia",
  estonia: "Estonia",
  latvian: "Latvia",
  latvia: "Latvia",
  lithuanian: "Lithuania",
  lithuania: "Lithuania",
  slovenian: "Slovenia",
  slovenia: "Slovenia",
  slovak: "Slovakia",
  slovakia: "Slovakia",
  macedonian: "North Macedonia",
  "north macedonia": "North Macedonia",
  montenegrin: "Montenegro",
  montenegro: "Montenegro",
  bosnian: "Bosnia and Herzegovina",
  "bosnia and herzegovina": "Bosnia and Herzegovina",
  bosnia: "Bosnia and Herzegovina",
  moldovan: "Moldova",
  moldova: "Moldova",
  luxembourgish: "Luxembourg",
  luxembourg: "Luxembourg",
  ethiopian: "Ethiopia",
  ethiopia: "Ethiopia",
  eritrean: "Eritrea",
  eritrea: "Eritrea",
  ugandan: "Uganda",
  uganda: "Uganda",
  tanzanian: "Tanzania",
  tanzania: "Tanzania",
  rwandan: "Rwanda",
  rwanda: "Rwanda",
  malawian: "Malawi",
  malawi: "Malawi",
  botswanan: "Botswana",
  botswana: "Botswana",
  namibian: "Namibia",
  namibia: "Namibia",
  madagascan: "Madagascar",
  madagascar: "Madagascar",
  mauritanian: "Mauritania",
  mauritania: "Mauritania",
  malian: "Mali",
  mali: "Mali",
  nigerien: "Niger",
  niger: "Niger",
  togolese: "Togo",
  togo: "Togo",
  gabonese: "Gabon",
  gabon: "Gabon",
  beninese: "Benin",
  benin: "Benin",
  liberian: "Liberia",
  liberia: "Liberia",
  "sierra leonean": "Sierra Leone",
  "sierra leone": "Sierra Leone",
  guinean: "Guinea",
  guinea: "Guinea",
  burkinabe: "Burkina Faso",
  "burkina faso": "Burkina Faso",
  paraguayan: "Paraguay",
  paraguay: "Paraguay",
  uruguayan: "Uruguay",
  uruguay: "Uruguay",
  bolivian: "Bolivia",
  bolivia: "Bolivia",
  ecuadorian: "Ecuador",
  ecuador: "Ecuador",
  salvadoran: "El Salvador",
  "el salvador": "El Salvador",
  guatemalan: "Guatemala",
  guatemala: "Guatemala",
  "puerto rican": "Puerto Rico",
  "puerto rico": "Puerto Rico",
};

/** Canonical country name -> demonym (adjective for Wikipedia queries). */
const COUNTRY_TO_DEMONYM: Record<string, string> = {
  "United States": "American",
  "United Kingdom": "British",
  England: "English",
  India: "Indian",
  Pakistan: "Pakistani",
  Germany: "German",
  Spain: "Spanish",
  Australia: "Australian",
  France: "French",
  Brazil: "Brazilian",
  Italy: "Italian",
  "South Africa": "South African",
  Canada: "Canadian",
  Austria: "Austrian",
  Mexico: "Mexican",
  Argentina: "Argentine",
  Portugal: "Portuguese",
  Netherlands: "Dutch",
  Russia: "Russian",
  China: "Chinese",
  Japan: "Japanese",
  "South Korea": "Korean",
  Turkey: "Turkish",
  Egypt: "Egyptian",
  Nigeria: "Nigerian",
  Kenya: "Kenyan",
  Ireland: "Irish",
  Scotland: "Scottish",
  Wales: "Welsh",
  Sweden: "Swedish",
  Norway: "Norwegian",
  Denmark: "Danish",
  Finland: "Finnish",
  Poland: "Polish",
  Greece: "Greek",
  Ukraine: "Ukrainian",
  Israel: "Israeli",
  Iran: "Iranian",
  Iraq: "Iraqi",
  Afghanistan: "Afghan",
  Bangladesh: "Bangladeshi",
  Thailand: "Thai",
  Vietnam: "Vietnamese",
  Indonesia: "Indonesian",
  Malaysia: "Malaysian",
  Philippines: "Filipino",
  Cuba: "Cuban",
  Colombia: "Colombian",
  Chile: "Chilean",
  Peru: "Peruvian",
  Venezuela: "Venezuelan",
  Jamaica: "Jamaican",
  Switzerland: "Swiss",
  Belgium: "Belgian",
  Hungary: "Hungarian",
  Romania: "Romanian",
  "Czech Republic": "Czech",
  Croatia: "Croatian",
  Serbia: "Serbian",
  Bulgaria: "Bulgarian",
  Albania: "Albanian",
  Iceland: "Icelandic",
  "New Zealand": "New Zealand",
  "Hong Kong": "Hong Kong",
  "Sri Lanka": "Sri Lankan",
  Nepal: "Nepali",
};

export function demonymFor(country: string): string {
  return COUNTRY_TO_DEMONYM[country] || country;
}

interface ProfessionEntry {
  /** Words/phrases that signal this profession (lowercase). */
  words: string[];
  /** Category slug in the local dataset. */
  category: string;
  /** Singular word used in Wikipedia queries. */
  wikiWord: string;
}

const PROFESSIONS: ProfessionEntry[] = [
  { words: ["actor", "actors", "actress", "actresses", "film actor", "movie actor"], category: "actors", wikiWord: "actor" },
  { words: ["singer", "singers", "vocalist", "vocalists", "pop star", "pop stars"], category: "singers", wikiWord: "singer" },
  { words: ["footballer", "footballers", "soccer player", "soccer players", "football player", "football players"], category: "footballers", wikiWord: "footballer" },
  { words: ["cricketer", "cricketers", "cricket player"], category: "cricketers", wikiWord: "cricketer" },
  { words: ["scientist", "scientists", "physicist", "physicists", "chemist", "chemists", "biologist", "biologists", "astronomer", "mathematician"], category: "scientists", wikiWord: "scientist" },
  { words: ["doctor", "doctors", "physician", "physicians", "surgeon", "surgeons"], category: "doctors", wikiWord: "doctor" },
  { words: ["writer", "writers", "author", "authors", "novelist", "novelists", "poet", "poets"], category: "writers", wikiWord: "writer" },
  { words: ["founder", "founders", "startup founder", "startup founders"], category: "startup-founders", wikiWord: "entrepreneur" },
  { words: ["entrepreneur", "entrepreneurs", "businessman", "businesswoman", "business leader", "business leaders", "ceo", "ceos", "tycoon"], category: "business-leaders", wikiWord: "businessman" },
  { words: ["athlete", "athletes", "olympian", "olympians", "sprinter", "sprinters", "swimmer", "swimmers", "runner", "runners", "jumper", "jumpers", "thrower", "throwers", "diver", "divers", "gymnast", "gymnasts", "golfer", "golfers", "cyclist", "cyclists", "skater", "skaters", "skier", "skiers", "hurdler", "hurdlers", "marathoner", "marathoners"], category: "athletes", wikiWord: "athlete" },
  { words: ["boxer", "boxers"], category: "boxers", wikiWord: "boxer" },
  { words: ["director", "directors", "filmmaker", "filmmakers"], category: "directors", wikiWord: "director" },
  { words: ["comedian", "comedians", "stand-up comic"], category: "comedians", wikiWord: "comedian" },
  { words: ["model", "models", "supermodel", "supermodels"], category: "models", wikiWord: "model" },
  { words: ["politician", "politicians", "president", "presidents", "prime minister", "prime ministers", "leader", "leaders", "statesman", "statesmen"], category: "politicians", wikiWord: "politician" },
  { words: ["youtuber", "youtubers", "youtube star"], category: "youtubers", wikiWord: "YouTuber" },
  { words: ["influencer", "influencers", "tiktoker", "tiktokers", "instagram star"], category: "social-media-influencers", wikiWord: "influencer" },
  { words: ["gamer", "gamers", "esports player"], category: "gamers", wikiWord: "gamer" },
  { words: ["journalist", "journalists", "reporter", "reporters", "news anchor"], category: "journalists", wikiWord: "journalist" },
  { words: ["lawyer", "lawyers", "judge", "judges", "attorney", "attorneys"], category: "lawyers", wikiWord: "lawyer" },
  { words: ["inventor", "inventors"], category: "inventors", wikiWord: "inventor" },
  { words: ["economist", "economists"], category: "economists", wikiWord: "economist" },
  { words: ["architect", "architects"], category: "architects", wikiWord: "architect" },
  { words: ["wrestler", "wrestlers"], category: "wrestlers", wikiWord: "wrestler" },
  { words: ["tv host", "tv hosts", "television host", "television hosts", "talk show host"], category: "tv-hosts", wikiWord: "television host" },
];

/** Words that mean NEW GENERATION (strict: born 2000 or later, living). */
const NEW_WORDS = [
  "new", "newer", "newest", "latest", "emerging", "rising",
  "gen z", "gen-z",
];

/** Words that mean MODERN (born 1990 or later, living preferred). */
const MODERN_WORDS = [
  "modern", "young", "younger", "youngest",
  "recent", "recently", "contemporary", "current",
  "trending", "youth", "millennial",
];

const HISTORICAL_WORDS = [
  "historical", "historic", "old", "older", "oldest", "classic", "classical",
  "legend", "legends", "legendary", "deceased", "past", "ancient", "vintage",
  "pioneer", "pioneers",
];

/** Filler words that carry no intent; stripped before name detection. */
const FILLER = new Set([
  "famous", "famed", "popular", "best", "top", "greatest", "well-known",
  "wellknown", "renowned", "notable", "people", "person", "persons",
  "personalities", "personality", "celebrities", "celebrity", "figures",
  "figure", "stars", "star", "from", "of", "the", "in", "and", "who",
  "are", "list", "all", "some", "most", "any", "find", "search", "show",
  "me", "world", "worldwide", "global", "international",
]);

function normalize(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Remove a matched phrase (word-boundary aware) from the working string. */
function removePhrase(text: string, phrase: string): string {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text
    .replace(new RegExp(`\\b${escaped}\\b`, "g"), " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsPhrase(text: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`).test(text);
}

export interface IntentVocabulary {
  /** Canonical country names present in the local dataset. */
  countries: string[];
  /** Category slugs present in the local dataset. */
  categories: string[];
}

export function parseSearchIntent(rawQuery: string, vocab: IntentVocabulary): SearchIntent {
  const raw = (rawQuery || "").trim();
  let working = normalize(raw);

  // ---- Era ----
  // Order matters: historical first, then NEW (strictest), then modern.
  // "new" is guarded against "New Zealand" / "New Zealander" — the word
  // "new" there is part of a country name, not an era signal.
  let era: Era = null;
  for (const w of HISTORICAL_WORDS) {
    if (containsPhrase(working, w)) {
      era = "historical";
      working = removePhrase(working, w);
    }
  }
  if (!era) {
    for (const w of NEW_WORDS) {
      if (w === "new" && (containsPhrase(working, "new zealand") || containsPhrase(working, "new zealander"))) {
        continue;
      }
      if (containsPhrase(working, w)) {
        era = "new";
        working = removePhrase(working, w);
      }
    }
  }
  if (!era) {
    for (const w of MODERN_WORDS) {
      if (containsPhrase(working, w)) {
        era = "modern";
        working = removePhrase(working, w);
      }
    }
  }

  // ---- Country ----
  // Multi-word demonyms / country names first (longest first).
  let country: string | null = null;
  let demonym: string | null = null;
  const aliasEntries = Object.entries(DEMONYMS).sort((a, b) => b[0].length - a[0].length);
  for (const [alias, canonical] of aliasEntries) {
    if (containsPhrase(working, alias)) {
      country = canonical;
      demonym = demonymFor(canonical);
      working = removePhrase(working, alias);
      break;
    }
  }
  if (!country) {
    // Fall back to exact dataset country names (covers countries without a demonym entry).
    const sorted = [...vocab.countries].sort((a, b) => b.length - a.length);
    for (const c of sorted) {
      const lowered = c.toLowerCase();
      if (containsPhrase(working, lowered)) {
        country = c;
        demonym = demonymFor(c);
        working = removePhrase(working, lowered);
        break;
      }
    }
  }

  // ---- Profession ----
  let profession: string | null = null;
  let professionWord: string | null = null;
  let professionSynonyms: string[] | null = null;
  const sortedProfessions = [...PROFESSIONS].sort(
    (a, b) => Math.max(...b.words.map((w) => w.length)) - Math.max(...a.words.map((w) => w.length))
  );
  for (const entry of sortedProfessions) {
    if (!vocab.categories.includes(entry.category)) continue;
    const words = [...entry.words].sort((a, b) => b.length - a.length);
    let matched = false;
    for (const w of words) {
      if (containsPhrase(working, w)) {
        profession = entry.category;
        professionWord = entry.wikiWord;
        professionSynonyms = entry.words;
        working = removePhrase(working, w);
        matched = true;
        break;
      }
    }
    if (matched) break;
  }

  // ---- Leftover tokens = person name (if any) ----
  const leftover = working
    .split(" ")
    .filter((t) => t && !FILLER.has(t))
    .join(" ")
    .trim();
  const personQuery = leftover || null;

  // ---- Kind ----
  let kind: SearchKind;
  if (country && profession) kind = "country+profession";
  else if (country) kind = "country";
  else if (profession) kind = "profession";
  else if (personQuery) kind = "person";
  else if (era) kind = "era";
  else kind = "broad";

  // A person name plus a country/profession is still a person search;
  // the country/profession only boosts ranking.
  if (personQuery && (country || profession)) kind = "person";

  // ---- Wikipedia queries (derived, tested against the live REST API) ----
  // Verified: "<Demonym> <profession>" returns real persons for
  // actor/singer/scientist/cricketer/boxer; a bare demonym ("Mexican") or
  // "<Demonym> people" returns almost no persons (lists / group articles).
  const wikiQueries: string[] = [];
  if (kind === "person") {
    wikiQueries.push(raw);
  } else if (kind === "country+profession" && demonym && professionWord) {
    wikiQueries.push(`${demonym} ${professionWord}`);
    // Athletes are filed under specific sports on Wikipedia; boxing titles
    // are the most reliable disambiguated person source for the category.
    if (profession === "athletes") wikiQueries.push(`${demonym} boxer`);
  } else if ((kind === "country" || kind === "era") && demonym) {
    // Pure-country discovery: one call per profession keeps the dropdown fast
    // (the API uses only the first); the full results page may use all three
    // in parallel for profession diversity.
    wikiQueries.push(`${demonym} actor`, `${demonym} singer`, `${demonym} scientist`);
  }
  // profession-only and era-only: no Wikipedia query — the local dataset
  // (30 profiles in each major category, 93 deceased profiles) covers them,
  // and Wikipedia's search API has no useful profession-only or era-only
  // person query (bare profession words return topic/list articles).

  return {
    kind,
    country,
    demonym,
    profession,
    professionWord,
    professionSynonyms,
    era,
    personQuery,
    wikiQueries,
    rawQuery: raw,
  };
}

/**
 * Find every demonym / country-name mention in a text, in order of
 * appearance. Used by the Wikipedia country check: an item's PRIMARY
 * association is the FIRST country mentioned — "American and Mexican
 * actor" is primarily American, "Mexican-American actor" is primarily
 * Mexican. Single-letter-ish aliases ("us", "sri") are excluded: "us"
 * is an English pronoun and would false-positive on ordinary prose.
 */
const DEMONYM_SCAN_EXCLUDE = new Set(["us", "sri"]);

export interface DemonymMention {
  /** The matched alias as written in the table, e.g. "mexican". */
  alias: string;
  /** Canonical country name, e.g. "Mexico". */
  country: string;
  /** Character index of the match in the scanned text. */
  index: number;
}

/** UK constituent countries count as the United Kingdom for matching, so
 *  an "English actor" is a British person (2026-11-25 accuracy audit:
 *  without this, an English person whose title lacks a "(British ...)"
 *  disambiguator was wrongly rejected for UK queries). */
const UK_CONSTITUENTS: Record<string, string> = {
  England: "United Kingdom",
  Scotland: "United Kingdom",
  Wales: "United Kingdom",
};

/** Normalize a country for comparison: UK constituents -> United Kingdom. */
export function normalizeCountryForMatch(country: string): string {
  return UK_CONSTITUENTS[country] || country;
}

/** "Born in <country>" phrases that also count for a country query:
 *  the country itself plus its UK constituents (born in England = UK). */
export function bornInPhrases(country: string): string[] {
  const phrases = [`born in ${country.toLowerCase()}`];
  for (const [constituent, parent] of Object.entries(UK_CONSTITUENTS)) {
    if (parent === country) phrases.push(`born in ${constituent.toLowerCase()}`);
  }
  return phrases;
}

export function findDemonymMentions(text: string): DemonymMention[] {
  const lowered = (text || "").toLowerCase();
  const mentions: DemonymMention[] = [];
  const aliases = Object.keys(DEMONYMS)
    .filter((a) => !DEMONYM_SCAN_EXCLUDE.has(a))
    .sort((a, b) => b.length - a.length);
  for (const alias of aliases) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(lowered)) !== null) {
      // "New Mexico" (the US state) and "New Mexican" (its demonym) are
      // NOT Mexico the country (2026-11-25 accuracy audit: American
      // politicians from New Mexico were slipping into Mexico results
      // because "Mexico" inside "New Mexico" matched). Skip a
      // mexico/mexican match whose preceding word is "new".
      if (
        (alias === "mexico" || alias === "mexican") &&
        /(?:^|\s)new\s*$/.test(lowered.slice(0, m.index))
      ) {
        continue;
      }
      mentions.push({ alias, country: DEMONYMS[alias], index: m.index });
    }
  }
  mentions.sort((a, b) => a.index - b.index);
  return mentions;
}
