/**
 * Filter to verify whether a Wikipedia article represents a famous human personality / person.
 * Excludes non-person entities like letters, symbols, places, films, albums, companies, and objects.
 */

// Negative patterns in title that indicate non-personality articles
const NEGATIVE_TITLE =
  /\b(filmography|discography|videography|bibliography|list of|outline of|timeline|chronology|season \d|episode \d|awards|award|letter|dynasty|empire|stadium|cup|championship|tournament|league|airport|station|university|college|hospital|family|brain of|equations|killing of|murder of|death of|assassination of|disappearance of)\b|\((?:film|movie|album|song|single|novel|book|play|soundtrack|magazine|newspaper|comic|dog|cat|horse|animal|band|group|company|brand|district|city|village|town|river|mountain|lake|island|province|country|station|airport|stadium|tv series|television series|video game|web series)\)$/i;

// Negative patterns in description indicating non-human entities
const NEGATIVE_DESC =
  /\b(disambiguation|topics referred to|list of|timeline of|chronology of|species of|genus of|family of (?:plants|animals)|family of|preserved brain|field-equations|letter to|letter from|award in|award for|river in|mountain in|lake in|ocean|island in|sea in|park in|city in|town in|village in|country in|province of|district of|state in|capital of|municipality of|county in|neighborhood in|film\b|movie\b|album\b|song\b|single by|soundtrack\b|television series|tv series|tv show|novel\b|book by|play by|painting by|sculpture by|musical group|rock band|pop group|boy band|girl group|orchestra|duo\b|trio\b|company\b|corporation\b|airline\b|automobile\b|software\b|website\b|video game|brand\b|currency\b|organization\b|political party|letter of|typeface\b|unicode\b|symbol\b|chemical compound|historical event|battle of|war in|treaty\b|election\b|series of microcomputers|computer model|hardware\b)/i;

// Positive patterns in description representing human professions, titles, and roles
const POSITIVE_DESC =
  /\b(actor|actress|director|filmmaker|producer|screenwriter|singer|musician|songwriter|rapper|composer|vocalist|dancer|choreographer|guitarist|drummer|pianist|cricketer|footballer|player|athlete|boxer|swimmer|wrestler|golfer|driver|racer|jumper|thrower|diver|runner|sprinter|hurdler|gymnast|skater|skier|cyclist|rower|sailor|shooter|archer|fencer|judoka|decathlete|heptathlete|pentathlete|triathlete|weightlifter|powerlifter|bodybuilder|surfer|snowboarder|climber|mountaineer|marathoner|racewalker|midfielder|goalkeeper|defender|striker|politician|president|prime minister|minister|senator|governor|mayor|king|queen|prince|princess|emperor|sultan|ruler|monarch|tsar|czar|dictator|diplomat|statesman|activist|revolutionary|freedom fighter|scientist|physicist|chemist|biologist|astronomer|mathematician|inventor|engineer|doctor|physician|surgeon|writer|author|poet|novelist|journalist|historian|philosopher|scholar|professor|academic|businessman|businesswoman|entrepreneur|executive|ceo|investor|founder|artist|painter|sculptor|photographer|architect|designer|model|comedian|youtuber|streamer|influencer|chef|pilot|astronaut|general|officer|soldier|admiral|commander|pope|bishop|priest|monk|cleric|imam|guru|saint|religious leader|public figure|celebrity|socialite|figure)\b/i;

const LIFESPAN =
  /\b(born \d{4}|\d{4}–\d{4}|\d{4}-\d{4}|born in \d{4}|born [a-z]+ \d{1,2}, \d{4})\b/i;

const EXCERPT_DATES =
  /\b(born \d{1,2} [a-z]+ \d{4}|born [a-z]+ \d{1,2}, \d{4}|\(\s*(?:born\s+)?(?:\d{1,2}\s+[a-z]+\s+)?\d{4}(?:\s*[–-]\s*(?:\d{1,2}\s+[a-z]+\s+)?\d{4})?\s*\))\b/i;

const EXCERPT_BIO =
  /\b(he is an?|he was an?|she is an?|she was an?|his career|her career|his early life|her early life|he played|she played|he won|she won|he served as|she served as|he was elected|she was elected|he starred|she starred)\b/i;

export interface WikiCandidate {
  title: string;
  description?: string | null;
  excerpt?: string | null;
}

export function isFamousPersonality(page: WikiCandidate): boolean {
  const title = (page.title || "").trim();
  const desc = (page.description || "").trim();
  const excerpt = (page.excerpt || "").trim();

  if (!title) return false;
  if (NEGATIVE_TITLE.test(title)) return false;
  if (NEGATIVE_DESC.test(desc)) return false;

  // Positive verification
  if (POSITIVE_DESC.test(desc)) return true;
  if (LIFESPAN.test(desc)) return true;
  if (EXCERPT_DATES.test(excerpt)) return true;
  if (EXCERPT_BIO.test(excerpt)) return true;

  return false;
}

