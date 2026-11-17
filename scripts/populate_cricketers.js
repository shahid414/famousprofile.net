const fs = require('fs');
const path = require('path');

const cricketers = [
  {
    slug: "imran-khan",
    name: "Imran Khan",
    category: "cricketers",
    profession: "All-Rounder & World Cup-Winning Captain",
    industry: "International Cricket",
    country: "Pakistan",
    birthDate: "1952-10-05",
    birthPlace: "Lahore, Punjab, Pakistan",
    languages: ["Urdu", "English", "Punjabi"],
    nickname: "Kaptaan",
    bio: "Imran Khan Niazi is a Pakistani former cricketer and philanthropist who captained Pakistan to its historic first Cricket World Cup victory in 1992. Regarded as one of cricket's greatest all-rounders alongside Kapil Dev, Ian Botham, and Richard Hadlee, he took 362 Test wickets and scored 3,807 runs. Following retirement, he founded Shaukat Khanum Memorial Cancer Hospital and later served as the 22nd Prime Minister of Pakistan.",
    famousWorks: [
      { year: 1982, title: "Taking 40 wickets in 6 Tests vs India" },
      { year: 1987, title: "Wisden Cricketer of the Year" },
      { year: 1992, title: "1992 Cricket World Cup Victory at MCG" },
      { year: 1994, title: "Founding Shaukat Khanum Cancer Hospital" }
    ],
    awards: [
      "Hilal-e-Imtiaz (Pakistan, 1992)",
      "ICC Cricket Hall of Fame Inductee (2010)",
      "Wisden Cricketer of the Year (1983)",
      "Pride of Performance Award (1983)"
    ],
    faq: [
      { q: "What was Imran Khan's greatest cricketing achievement?", a: "Leading an underdog Pakistan side from the brink of elimination to victory in the 1992 Cricket World Cup in Melbourne." },
      { q: "How many Test wickets did Imran Khan take?", a: "He captured 362 Test wickets in 88 matches at a remarkable bowling average of 22.81." },
      { q: "What famous philanthropic institution did he build?", a: "He established the Shaukat Khanum Memorial Cancer Hospital in Lahore in 1994, offering free treatment to underprivileged patients." }
    ],
    related: ["wasim-akram", "waqar-younis", "sachin-tendulkar"],
    sources: [
      "https://en.wikipedia.org/wiki/Imran_Khan",
      "https://www.espncricinfo.com/player/imran-khan-40560"
    ],
    image: "/avatars/imran-khan.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "virat-kohli",
    name: "Virat Kohli",
    category: "cricketers",
    profession: "Top-Order Batsman & Former Captain",
    industry: "International Cricket",
    country: "India",
    birthDate: "1988-11-05",
    birthPlace: "Delhi, India",
    languages: ["Hindi", "English", "Punjabi"],
    nickname: "King Kohli / Run Machine",
    bio: "Virat Kohli is an Indian international cricketer regarded as one of the greatest batsmen in the history of the sport and the supreme chase master in white-ball cricket. He holds the world record for the most centuries in One Day Internationals (50 centuries), surpassing Sachin Tendulkar during the 2023 World Cup. Under his captaincy, India rose to become the undisputed number one Test team in the world.",
    famousWorks: [
      { year: 2011, title: "ICC Cricket World Cup Champion" },
      { year: 2013, title: "ICC Champions Trophy Winner" },
      { year: 2018, title: "Leading India to First-Ever Test Series Victory in Australia" },
      { year: 2023, title: "Record 50th ODI Century (ICC World Cup Semifinal)" },
      { year: 2024, title: "ICC Men's T20 World Cup Champion" }
    ],
    awards: [
      "Padma Shri (Government of India, 2017)",
      "Major Dhyan Chand Khel Ratna Award (2018)",
      "ICC Male Cricketer of the Decade (2011–2020)",
      "Polly Umrigar Award for Best International Cricketer (Record 5 times)"
    ],
    faq: [
      { q: "How many international centuries has Virat Kohli scored?", a: "He has scored 80 international centuries across Tests, ODIs, and T20Is, ranking second only to Sachin Tendulkar." },
      { q: "Who holds the record for most ODI centuries in history?", a: "Virat Kohli holds the world record with 50 ODI centuries, achieving the milestone in the 2023 World Cup." },
      { q: "What IPL franchise has Virat Kohli represented exclusively?", a: "Royal Challengers Bengaluru (RCB), playing for the team continuously since the tournament's inaugural 2008 season." }
    ],
    related: ["sachin-tendulkar", "ms-dhoni", "rohit-sharma"],
    sources: [
      "https://en.wikipedia.org/wiki/Virat_Kohli",
      "https://www.espncricinfo.com/player/virat-kohli-253802"
    ],
    image: "/avatars/virat-kohli.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "sachin-tendulkar",
    name: "Sachin Tendulkar",
    category: "cricketers",
    profession: "Batsman",
    industry: "International Cricket",
    country: "India",
    birthDate: "1973-04-24",
    birthPlace: "Bombay (Mumbai), Maharashtra, India",
    languages: ["Marathi", "Hindi", "English"],
    nickname: "Master Blaster / God of Cricket",
    bio: "Sachin Ramesh Tendulkar is an Indian former international cricketer widely acknowledged as the most complete batsman of his era and the sport's greatest icon. Making his international debut at age sixteen, he played at the highest level for twenty-four years, becoming the only player to score 100 international centuries and over 34,000 runs. In 2014, he became the youngest person and first sportsperson awarded the Bharat Ratna.",
    famousWorks: [
      { year: 1998, title: "Desert Storm Innings in Sharjah vs Australia" },
      { year: 2003, title: "Player of the Tournament (2003 ICC Cricket World Cup)" },
      { year: 2010, title: "First Double Century in Men's ODI Cricket (200* vs South Africa)" },
      { year: 2011, title: "2011 ICC Cricket World Cup Champion" },
      { year: 2012, title: "100th International Century vs Bangladesh" }
    ],
    awards: [
      "Bharat Ratna (India's Highest Civilian Award, 2014)",
      "Padma Vibhushan (2008) & Padma Shri (1999)",
      "ICC Cricket Hall of Fame Inductee (2019)",
      "Wisden Leading Cricketer in the World"
    ],
    faq: [
      { q: "How many international runs did Sachin Tendulkar score?", a: "He scored a record 34,357 international runs: 15,921 in Tests and 18,426 in ODIs." },
      { q: "Who scored the first double century in Men's ODI history?", a: "Sachin Tendulkar scored exactly 200 not out against South Africa in Gwalior on February 24, 2010." },
      { q: "How many World Cups did Sachin Tendulkar play in?", a: "He participated in six World Cups (1992, 1996, 1999, 2003, 2007, 2011), lifting the trophy in Mumbai in 2011." }
    ],
    related: ["virat-kohli", "brian-lara", "wasim-akram"],
    sources: [
      "https://en.wikipedia.org/wiki/Sachin_Tendulkar",
      "https://www.espncricinfo.com/player/sachin-tendulkar-35320"
    ],
    image: "/avatars/sachin-tendulkar.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "wasim-akram",
    name: "Wasim Akram",
    category: "cricketers",
    profession: "Fast Bowler & Cricket Commentator",
    industry: "International Cricket",
    country: "Pakistan",
    birthDate: "1966-06-03",
    birthPlace: "Lahore, Punjab, Pakistan",
    languages: ["Urdu", "Punjabi", "English"],
    nickname: "Sultan of Swing",
    bio: "Wasim Akram is a Pakistani cricket commentator, coach, and former cricketer widely acknowledged as the greatest left-arm fast bowler in the history of cricket. Renowned for mastering reverse swing, express pace, and lethal yorkers from a quick whip-like action, he took 414 Test wickets and 502 ODI wickets. His man-of-the-match bowling in the 1992 World Cup final sealed Pakistan's maiden world title.",
    famousWorks: [
      { year: 1992, title: "Man of the Match (1992 World Cup Final vs England)" },
      { year: 1996, title: "Double Century (257* vs Zimbabwe in Sheikhupura)" },
      { year: 1999, title: "Leading Pakistan to 1999 Cricket World Cup Final" },
      { year: 2003, title: "First Bowler to Reach 500 ODI Wickets" }
    ],
    awards: [
      "Hilal-e-Imtiaz (Government of Pakistan, 2019)",
      "ICC Cricket Hall of Fame Inductee (2009)",
      "Wisden Cricketer of the Year (1993)",
      "Pride of Performance Award (1992)"
    ],
    faq: [
      { q: "Why was Wasim Akram called the Sultan of Swing?", a: "His extraordinary ability to swing the ball both conventionally and in reverse at high speed earned him the title worldwide." },
      { q: "How many international hat-tricks did Wasim Akram take?", a: "He took four international hat-tricks: two in Test cricket and two in One Day Internationals." },
      { q: "What was his famous double-breakthrough in the 1992 World Cup Final?", a: "In two consecutive balls, he clean-bowled Allan Lamb and Chris Lewis with unplayable reverse-swinging deliveries." }
    ],
    related: ["imran-khan", "waqar-younis", "shoaib-akhtar"],
    sources: [
      "https://en.wikipedia.org/wiki/Wasim_Akram",
      "https://www.espncricinfo.com/player/wasim-akram-43547"
    ],
    image: "/avatars/wasim-akram.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "babar-azam",
    name: "Babar Azam",
    category: "cricketers",
    profession: "Top-Order Batsman",
    industry: "International Cricket",
    country: "Pakistan",
    birthDate: "1994-10-15",
    birthPlace: "Lahore, Punjab, Pakistan",
    languages: ["Urdu", "Punjabi", "English"],
    nickname: "King Babar / Bobby",
    bio: "Mohammad Babar Azam is a Pakistani international cricketer and former captain celebrated for his textbook classical batting technique and majestic cover drive. Holding multiple world records for speed to ODI centuries and ranking as the number one ODI batsman for over two consecutive years, he led Pakistan to the final of the 2022 ICC Men's T20 World Cup. He was awarded Pakistan's Sitara-e-Imtiaz at age 28.",
    famousWorks: [
      { year: 2019, title: "World Cup Century vs New Zealand at Edgbaston" },
      { year: 2021, title: "Leading Pakistan to Historic 10-Wicket Victory vs India in T20 World Cup" },
      { year: 2022, title: "Epic 196 vs Australia in Karachi Test 4th Innings" },
      { year: 2022, title: "Leading Pakistan to Final of ICC Men's T20 World Cup" }
    ],
    awards: [
      "Sitara-e-Imtiaz (Youngest recipient in cricket history, 2023)",
      "ICC Men's Cricketer of the Year (Sir Garfield Sobers Trophy, 2022)",
      "ICC Men's ODI Cricketer of the Year (2021, 2022)",
      "ICC Men's ODI Team of the Year Captain"
    ],
    faq: [
      { q: "What is Babar Azam's signature batting stroke?", a: "His cover drive is universally lauded by cricket purists and commentators as the most aesthetically flawless in the game." },
      { q: "What record did he achieve against India in the 2021 T20 World Cup?", a: "He captained Pakistan to their first-ever World Cup victory against India, winning by 10 wickets alongside Mohammad Rizwan." },
      { q: "What national honor did Babar Azam receive in 2023?", a: "He was conferred the Sitara-e-Imtiaz, becoming the youngest cricketer ever to receive Pakistan's third-highest civilian honor." }
    ],
    related: ["virat-kohli", "inzamam-ul-haq", "shaheen-afridi"],
    sources: [
      "https://en.wikipedia.org/wiki/Babar_Azam",
      "https://www.espncricinfo.com/player/babar-azam-348144"
    ],
    image: "/avatars/babar-azam.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "ms-dhoni",
    name: "MS Dhoni",
    category: "cricketers",
    profession: "Wicketkeeper-Batsman & Former Captain",
    industry: "International Cricket & IPL",
    country: "India",
    birthDate: "1981-07-07",
    birthPlace: "Ranchi, Bihar (Jharkhand), India",
    languages: ["Hindi", "English"],
    nickname: "Captain Cool / Thala / Mahi",
    bio: "Mahendra Singh Dhoni is an Indian former international cricketer who captained the Indian national team in limited-overs formats from 2007 to 2017 and in Test cricket from 2008 to 2014. He is the only captain in cricket history to win all three major ICC white-ball trophies: the 2007 T20 World Cup, 2011 Cricket World Cup, and 2013 Champions Trophy. Celebrated for his lightning-fast stumpings and ice-cool finishing, he also led Chennai Super Kings to five IPL titles.",
    famousWorks: [
      { year: 2007, title: "ICC World Twenty20 Champion (Inaugural Edition)" },
      { year: 2011, title: "Match-winning 91* & Winning Six in 2011 World Cup Final" },
      { year: 2013, title: "ICC Champions Trophy Champion" },
      { year: 2023, title: "Leading Chennai Super Kings to Record-Equaling 5th IPL Title" }
    ],
    awards: [
      "Padma Bhushan (2018) & Padma Shri (2009)",
      "Major Dhyan Chand Khel Ratna Award (2007–08)",
      "ICC ODI Player of the Year (2008, 2009)",
      "Honorary Lieutenant Colonel in the Indian Territorial Army"
    ],
    faq: [
      { q: "What unique ICC captaincy record does MS Dhoni hold?", a: "He is the only captain in cricket history to lift all three ICC limited-overs trophies: T20 World Cup (2007), ODI World Cup (2011), and Champions Trophy (2013)." },
      { q: "What was his iconic World Cup winning shot?", a: "His monstrous six over long-on off Nuwan Kulasekara at Wankhede Stadium to seal the 2011 World Cup for India." },
      { q: "Which IPL team did Dhoni captain to five titles?", a: "Chennai Super Kings (CSK), winning championships in 2010, 2011, 2018, 2021, and 2023." }
    ],
    related: ["virat-kohli", "rohit-sharma", "sachin-tendulkar"],
    sources: [
      "https://en.wikipedia.org/wiki/MS_Dhoni",
      "https://www.espncricinfo.com/player/ms-dhoni-28081"
    ],
    image: "/avatars/ms-dhoni.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "shoaib-akhtar",
    name: "Shoaib Akhtar",
    category: "cricketers",
    profession: "Fast Bowler & Media Personality",
    industry: "International Cricket",
    country: "Pakistan",
    birthDate: "1975-08-13",
    birthPlace: "Rawalpindi, Punjab, Pakistan",
    languages: ["Urdu", "Punjabi", "English"],
    nickname: "Rawalpindi Express",
    bio: "Shoaib Akhtar is a Pakistani former cricketer and television commentator who holds the official world record for bowling the fastest recorded delivery in cricket history at 161.3 km/h (100.2 mph). Known for his long thunderous run-up, fierce bouncers, and charismatic flair, he claimed 444 international wickets across formats. In 1999, his double-wicket maiden at Eden Gardens dismissing Rahul Dravid and Sachin Tendulkar in consecutive balls became legendary.",
    famousWorks: [
      { year: 1999, title: "Clean-bowling Rahul Dravid and Sachin Tendulkar on consecutive balls at Eden Gardens" },
      { year: 2002, title: "First bowler to officially break the 100 mph barrier" },
      { year: 2003, title: "Fastest ball in cricket history (161.3 km/h vs England at World Cup)" },
      { year: 2006, title: "Match-winning performance vs England in Test series" }
    ],
    awards: [
      "Sitara-e-Imtiaz (Government of Pakistan, 2019)",
      "Guinness World Record for Fastest Delivery in Cricket History",
      "Wisden Best Spell of the Year (2000)"
    ],
    faq: [
      { q: "What was the speed of the fastest delivery ever bowled in cricket?", a: "Shoaib Akhtar bowled at 161.3 km/h (100.23 mph) against Nick Knight of England during the 2003 World Cup in Cape Town." },
      { q: "Why was Shoaib Akhtar nicknamed the Rawalpindi Express?", a: "His hometown is Rawalpindi, Pakistan, and his locomotive-like speed and stamina inspired the moniker." },
      { q: "What was his iconic performance in Kolkata in 1999?", a: "At Eden Gardens before 100,000 spectators, he clean-bowled Rahul Dravid and Sachin Tendulkar off consecutive yorkers." }
    ],
    related: ["wasim-akram", "waqar-younis", "brett-lee"],
    sources: [
      "https://en.wikipedia.org/wiki/Shoaib_Akhtar",
      "https://www.espncricinfo.com/player/shoaib-akhtar-42655"
    ],
    image: "/avatars/shoaib-akhtar.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "rohit-sharma",
    name: "Rohit Sharma",
    category: "cricketers",
    profession: "Opening Batsman & Captain",
    industry: "International Cricket & IPL",
    country: "India",
    birthDate: "1987-04-30",
    birthPlace: "Nagpur, Maharashtra, India",
    languages: ["Hindi", "Marathi", "Telugu", "English"],
    nickname: "Hitman",
    bio: "Rohit Gurunath Sharma is an Indian international cricketer and captain who holds the record for the highest individual score in One Day International history (264 against Sri Lanka). The only player in cricket history to score three double centuries in ODIs, he is renowned for his effortless pull shot and destructive power-hitting. He captained India to victory in the 2024 ICC Men's T20 World Cup.",
    famousWorks: [
      { year: 2014, title: "World Record 264 vs Sri Lanka at Eden Gardens" },
      { year: 2019, title: "Record 5 Centuries in a Single World Cup Tournament" },
      { year: 2020, title: "Leading Mumbai Indians to 5th IPL Trophy" },
      { year: 2024, title: "Captaining India to ICC Men's T20 World Cup Championship" }
    ],
    awards: [
      "Major Dhyan Chand Khel Ratna Award (2020)",
      "Arjuna Award (2015)",
      "ICC Men's ODI Cricketer of the Year (2019)",
      "Record 5-time IPL Championship Captain"
    ],
    faq: [
      { q: "What is the highest individual score in ODI cricket history?", a: "Rohit Sharma scored 264 runs off 173 balls against Sri Lanka at Eden Gardens, Kolkata, on November 13, 2014." },
      { q: "How many ODI double centuries has Rohit Sharma scored?", a: "He has scored three double centuries (209 vs Australia, 264 vs Sri Lanka, and 208* vs Sri Lanka), a feat unmatched by any other cricketer." },
      { q: "What major international tournament did he win as captain in 2024?", a: "He captained India to an undefeated campaign to win the 2024 ICC Men's T20 World Cup in Barbados." }
    ],
    related: ["virat-kohli", "ms-dhoni", "sachin-tendulkar"],
    sources: [
      "https://en.wikipedia.org/wiki/Rohit_Sharma",
      "https://www.espncricinfo.com/player/rohit-sharma-34102"
    ],
    image: "/avatars/rohit-sharma.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "brian-lara",
    name: "Brian Lara",
    category: "cricketers",
    profession: "Top-Order Batsman",
    industry: "International Cricket",
    country: "Trinidad and Tobago",
    birthDate: "1969-05-02",
    birthPlace: "Santa Cruz, Trinidad and Tobago",
    languages: ["English"],
    nickname: "The Prince of Trinidad",
    bio: "Brian Charles Lara is a Trinidadian former international cricketer widely regarded as one of the greatest batsmen to ever grace the game. He holds two of the most daunting batting records in history: the highest individual score in first-class cricket (501 not out for Warwickshire in 1994) and the highest individual score in a Test innings (400 not out against England in 2004). His high backlift and flourishing strokeplay captivated generations.",
    famousWorks: [
      { year: 1994, title: "Record 375 vs England at St. John's, Antigua" },
      { year: 1994, title: "World-Record 501 Not Out for Warwickshire" },
      { year: 1999, title: "Incomparable 153* vs Australia in Bridgetown" },
      { year: 2004, title: "All-Time Test Record 400 Not Out vs England" }
    ],
    awards: [
      "ICC Cricket Hall of Fame Inductee (2012)",
      "Honorary Member of the Order of Australia (AM)",
      "Wisden Leading Cricketer in the World (1994, 1995)",
      "Trinity Cross (Trinidad and Tobago's Highest Honour)"
    ],
    faq: [
      { q: "What is the highest individual score in Test cricket history?", a: "Brian Lara's 400 not out against England at the Antigua Recreation Ground in April 2004." },
      { q: "What is the highest individual score in First-Class cricket?", a: "Brian Lara scored 501 not out for Warwickshire against Durham at Edgbaston in 1994." },
      { q: "What was his greatest fourth-innings Test performance?", a: "His 153 not out against Australia in Barbados in 1999, guiding West Indies to a sensational one-wicket victory." }
    ],
    related: ["sachin-tendulkar", "viv-richards", "ricky-ponting"],
    sources: [
      "https://en.wikipedia.org/wiki/Brian_Lara",
      "https://www.espncricinfo.com/player/brian-lara-52337"
    ],
    image: "/avatars/brian-lara.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "sir-don-bradman",
    name: "Sir Don Bradman",
    category: "cricketers",
    profession: "Batsman",
    industry: "Test Cricket",
    country: "Australia",
    birthDate: "1908-08-27",
    deathDate: "2001-02-25",
    birthPlace: "Cootamundra, New South Wales, Australia",
    languages: ["English"],
    nickname: "The Don",
    bio: "Sir Donald George Bradman was an Australian international cricketer generally acknowledged as the greatest batsman of all time and the most statistically dominant athlete in any major sport. His career Test batting average of 99.94 is cited as the greatest achievement by any sportsman in history. During the Great Depression, his extraordinary batting prowess provided national pride and inspiration to Australia.",
    famousWorks: [
      { year: 1930, title: "Scoring 974 runs in a single Ashes series (World Record)" },
      { year: 1930, title: "Triple century in a single day (309* at Headingley)" },
      { year: 1932, title: "Bodyline Series controversy vs England" },
      { year: 1948, title: "Leading 'The Invincibles' tour of England without a single defeat" }
    ],
    awards: [
      "Knight Bachelor (1949, first Australian cricketer knighted)",
      "Companion of the Order of Australia (AC, 1979)",
      "ICC Cricket Hall of Fame Inductee (2009 inaugural)",
      "Wisden Cricketer of the Century (100 out of 100 votes)"
    ],
    faq: [
      { q: "What was Sir Don Bradman's final Test batting average?", a: "99.94, needing just four runs in his final innings at The Oval in 1948 to achieve an average of 100, but fell for a duck." },
      { q: "What was 'The Invincibles' team?", a: "The 1948 Australian touring team captained by Bradman that went through their entire 34-match tour of England undefeated." },
      { q: "How did Bradman practice his batting as a boy?", a: "He practiced endlessly by hitting a golf ball against a curved brick water tank stand with a cricket stump." }
    ],
    related: ["shane-warne", "ricky-ponting", "viv-richards"],
    sources: [
      "https://en.wikipedia.org/wiki/Don_Bradman",
      "https://www.espncricinfo.com/player/don-bradman-4188"
    ],
    image: "/avatars/sir-don-bradman.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "viv-richards",
    name: "Viv Richards",
    category: "cricketers",
    profession: "Batsman & Captain",
    industry: "International Cricket",
    country: "Antigua and Barbuda",
    birthDate: "1952-03-07",
    birthPlace: "St. John's, Antigua and Barbuda",
    languages: ["English"],
    nickname: "The Master Blaster / King Viv",
    bio: "Sir Isaac Vivian Alexander Richards is an Antiguan former international cricketer widely regarded as the most devastating, intimidating, and destructive batsman in the history of cricket. Dominating world fast bowling without ever wearing a helmet, he played with effortless swagger and supreme authority. He was the linchpin of Clive Lloyd's West Indies dynasty that won the 1975 and 1979 Cricket World Cups.",
    famousWorks: [
      { year: 1975, title: "Crucial run-outs in 1975 World Cup Final" },
      { year: 1976, title: "1,710 Test runs in a calendar year (historic record)" },
      { year: 1979, title: "Match-winning 138* in 1979 World Cup Final vs England" },
      { year: 1986, title: "Fastest Test century in 56 balls vs England in Antigua" }
    ],
    awards: [
      "Knight Commander of the Most Distinguished Order of the Nation (Antigua, 1999)",
      "ICC Cricket Hall of Fame Inductee (2009)",
      "Wisden Cricketer of the Century (One of five chosen)",
      "Officer of the Order of the British Empire (OBE, 1994)"
    ],
    faq: [
      { q: "Did Viv Richards ever wear a batting helmet?", a: "No, throughout his entire career facing the fiercest 95-mph fast bowlers of his era, he resolutely refused to wear a helmet." },
      { q: "What was his famous record against England in 1986?", a: "He smashed a blistering Test century in just 56 balls in Antigua, which stood as the fastest Test century for three decades." },
      { q: "Never losing a Test series as captain?", a: "As captain of the West Indies in 50 Test matches, he never lost a single Test series." }
    ],
    related: ["brian-lara", "sir-don-bradman", "imran-khan"],
    sources: [
      "https://en.wikipedia.org/wiki/Viv_Richards",
      "https://www.espncricinfo.com/player/viv-richards-52812"
    ],
    image: "/avatars/viv-richards.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "shane-warne",
    name: "Shane Warne",
    category: "cricketers",
    profession: "Leg-Spin Bowler",
    industry: "International Cricket",
    country: "Australia",
    birthDate: "1969-09-13",
    deathDate: "2022-03-04",
    birthPlace: "Upper Ferntree Gully, Victoria, Australia",
    languages: ["English"],
    nickname: "King of Spin / Warnie",
    bio: "Shane Keith Warne was an Australian international cricketer widely acknowledged as the greatest spin bowler in cricket history, single-handedly reviving the art of leg spin in the 1990s. With his charismatic showmanship, extraordinary drift, and ferocious turn, he captured 708 Test wickets and 293 ODI wickets. His 1993 delivery to Mike Gatting, dubbed the 'Ball of the Century', remains the most famous ball ever bowled.",
    famousWorks: [
      { year: 1993, title: "The 'Ball of the Century' to dismiss Mike Gatting at Old Trafford" },
      { year: 1999, title: "Man of the Match in 1999 Cricket World Cup Semifinal & Final" },
      { year: 2005, title: "Taking 40 wickets in the iconic 2005 Ashes series" },
      { year: 2008, title: "Captaining Rajasthan Royals to the Inaugural IPL Title" }
    ],
    awards: [
      "Wisden Cricketer of the Century (One of five chosen)",
      "ICC Cricket Hall of Fame Inductee (2013)",
      "Officer of the Order of Australia (AO, Posthumous 2022)",
      "Australian Cricket Hall of Fame (2012)"
    ],
    faq: [
      { q: "What was the 'Ball of the Century'?", a: "Shane Warne's first delivery in an Ashes Test in 1993, which drifted outside Mike Gatting's leg stump and spun violently to clip the off stump." },
      { q: "How many Test wickets did Shane Warne take?", a: "He captured 708 Test wickets in 145 matches, retiring as the highest wicket-taker in Australian Test history." },
      { q: "Which team did he lead to victory in the first-ever IPL season?", a: "He captained and coached the Rajasthan Royals to become inaugural IPL champions in 2008." }
    ],
    related: ["muttiah-muralitharan", "ricky-ponting", "glenn-mcgrath"],
    sources: [
      "https://en.wikipedia.org/wiki/Shane_Warne",
      "https://www.espncricinfo.com/player/shane-warne-8166"
    ],
    image: "/avatars/shane-warne.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "muttiah-muralitharan",
    name: "Muttiah Muralitharan",
    category: "cricketers",
    profession: "Off-Spin Bowler",
    industry: "International Cricket",
    country: "Sri Lanka",
    birthDate: "1972-04-17",
    birthPlace: "Kandy, Sri Lanka",
    languages: ["Sinhala", "Tamil", "English"],
    nickname: "Murali",
    bio: "Muttiah Muralitharan is a Sri Lankan former cricketer widely recognized as the most prolific wicket-taker in the history of international cricket. Possessing an extraordinary wrist-spin action and mastery of the 'doosra', he holds the world record for the most wickets in both Test cricket (800 wickets) and One Day Internationals (534 wickets). He was an instrumental pillar of Sri Lanka's 1996 World Cup victory.",
    famousWorks: [
      { year: 1996, title: "ICC Cricket World Cup Champion" },
      { year: 1998, title: "Taking 16 wickets at The Oval vs England" },
      { year: 2007, title: "Surpassing Shane Warne to become world's leading Test wicket-taker" },
      { year: 2010, title: "Taking his 800th Test wicket on his final delivery in Test cricket" }
    ],
    awards: [
      "ICC Cricket Hall of Fame Inductee (2017)",
      "Wisden Leading Cricketer in the World (2000, 2006)",
      "All-time record holder for most Test (800) and ODI (534) wickets"
    ],
    faq: [
      { q: "Who holds the record for most wickets in Test cricket history?", a: "Muttiah Muralitharan holds the world record with exactly 800 Test wickets." },
      { q: "How did Muralitharan take his 800th wicket?", a: "In his final Test match against India in Galle in 2010, he had Pragyan Ojha caught at slip on his final spell to reach 800 wickets." },
      { q: "How many 5-wicket hauls in Test cricket did he claim?", a: "He took an astonishing 67 five-wicket hauls and 22 ten-wicket match hauls, both unmatched all-time records." }
    ],
    related: ["shane-warne", "kumar-sangakkara", "wasim-akram"],
    sources: [
      "https://en.wikipedia.org/wiki/Muttiah_Muralitharan",
      "https://www.espncricinfo.com/player/muttiah-muralitharan-49636"
    ],
    image: "/avatars/muttiah-muralitharan.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "ricky-ponting",
    name: "Ricky Ponting",
    category: "cricketers",
    profession: "Top-Order Batsman & Captain",
    industry: "International Cricket",
    country: "Australia",
    birthDate: "1974-12-19",
    birthPlace: "Launceston, Tasmania, Australia",
    languages: ["English"],
    nickname: "Punter",
    bio: "Ricky Thomas Ponting is an Australian cricket coach, commentator, and former cricketer who is the most successful captain in international cricket history, with 220 victories in 324 matches. Renowned for his ferocious pull shot and peerless slip fielding, he won three consecutive Cricket World Cups (1999, 2003, and 2007), captaining the 2003 and 2007 undefeated campaigns. He scored 71 international centuries.",
    famousWorks: [
      { year: 1999, title: "ICC Cricket World Cup Champion" },
      { year: 2003, title: "Sensational 140* in 2003 World Cup Final vs India as Captain" },
      { year: 2006, title: "Twin centuries in his 100th Test match vs South Africa" },
      { year: 2007, title: "Captaining Australia to undefeated 2007 World Cup triumph" }
    ],
    awards: [
      "Officer of the Order of Australia (AO, 2012)",
      "ICC Cricket Hall of Fame Inductee (2018)",
      "ICC Player of the Year (Sir Garfield Sobers Trophy, 2006, 2007)",
      "Allan Border Medal (Record 4 times)"
    ],
    faq: [
      { q: "How many World Cups did Ricky Ponting win?", a: "He won three World Cups with Australia (1999, 2003, and 2007), serving as captain for the last two undefeated victories." },
      { q: "What was his score in the 2003 World Cup Final?", a: "He smashed an unbeaten 140 runs off 121 balls with eight sixes against India in Johannesburg." },
      { q: "How many international runs did Ricky Ponting score?", a: "He scored 27,483 international runs, ranking third in all-time cricket history behind Tendulkar and Sangakkara." }
    ],
    related: ["shane-warne", "glenn-mcgrath", "steve-smith"],
    sources: [
      "https://en.wikipedia.org/wiki/Ricky_Ponting",
      "https://www.espncricinfo.com/player/ricky-ponting-7133"
    ],
    image: "/avatars/ricky-ponting.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "jacques-kallis",
    name: "Jacques Kallis",
    category: "cricketers",
    profession: "All-Rounder",
    industry: "International Cricket",
    country: "South Africa",
    birthDate: "1975-10-16",
    birthPlace: "Pinelands, Cape Town, South Africa",
    languages: ["English", "Afrikaans"],
    nickname: "Woogie",
    bio: "Jacques Henry Kallis is a South African cricket coach and former cricketer universally lauded as the greatest all-rounder of modern cricket. As an immovable classical batsman and a genuine 140 km/h fast-medium bowler, he is the only player in cricket history to score over 10,000 runs and take over 250 wickets in both Test and ODI cricket. His 45 Test centuries rank second in history.",
    famousWorks: [
      { year: 1998, title: "ICC KnockOut Trophy Champion (South Africa's only ICC title)" },
      { year: 2004, title: "Centuries in 5 consecutive Test matches" },
      { year: 2010, title: "Double century (201* vs India in Centurion)" },
      { year: 2013, title: "Century in his farewell Test match vs India at Durban" }
    ],
    awards: [
      "ICC Cricket Hall of Fame Inductee (2020)",
      "ICC Player of the Year (2005)",
      "Wisden Leading Cricketer in the World (2007)",
      "Order of Ikhamanga in Silver (South Africa)"
    ],
    faq: [
      { q: "What unique milestone does Jacques Kallis hold?", a: "He is the only cricketer in history to achieve 10,000+ runs and 250+ wickets in both Test and ODI cricket." },
      { q: "How many Test centuries did Jacques Kallis score?", a: "He scored 45 Test centuries, second only to Sachin Tendulkar's 51." },
      { q: "How many catches did he take in Test cricket?", a: "He took 200 catches in Test cricket, standing as one of the safest slip fielders in history." }
    ],
    related: ["imran-khan", "ab-de-villiers", "sachin-tendulkar"],
    sources: [
      "https://en.wikipedia.org/wiki/Jacques_Kallis",
      "https://www.espncricinfo.com/player/jacques-kallis-45789"
    ],
    image: "/avatars/jacques-kallis.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "kapil-dev",
    name: "Kapil Dev",
    category: "cricketers",
    profession: "All-Rounder & World Cup-Winning Captain",
    industry: "International Cricket",
    country: "India",
    birthDate: "1959-01-06",
    birthPlace: "Chandigarh, India",
    languages: ["Hindi", "Punjabi", "English"],
    nickname: "Haryana Hurricane",
    bio: "Kapil Dev Ramlal Nikhanj is an Indian former cricketer who captained India to its maiden Cricket World Cup triumph in 1983, defeating the two-time reigning champion West Indies. A dynamic fast bowler and aggressive middle-order batsman, he held the world record for the greatest number of Test wickets (434 wickets) upon his retirement in 1994. In 2002, Wisden named him the Indian Cricketer of the Century.",
    famousWorks: [
      { year: 1983, title: "Legendary 175* vs Zimbabwe at Tunbridge Wells" },
      { year: 1983, title: "Captaining India to historic 1983 World Cup Championship at Lord's" },
      { year: 1990, title: "Hitting four consecutive sixes off Eddie Hemmings to avoid follow-on" },
      { year: 1994, title: "Breaking Richard Hadlee's world record with 434 Test wickets" }
    ],
    awards: [
      "Padma Bhushan (1991) & Padma Shri (1982)",
      "Wisden Indian Cricketer of the Century (2002)",
      "ICC Cricket Hall of Fame Inductee (2010)",
      "Honorary Lieutenant Colonel in Indian Territorial Army"
    ],
    faq: [
      { q: "What was Kapil Dev's most famous innings in the 1983 World Cup?", a: "His sensational 175 not out against Zimbabwe when India was reeling at 17 for 5, a match unfortunately not broadcast due to a BBC strike." },
      { q: "What was his famous catch in the 1983 World Cup Final?", a: "His running backward catch over his shoulder to dismiss the dangerous Viv Richards off Madan Lal at Lord's." },
      { q: "Did Kapil Dev ever miss a Test match due to fitness?", a: "Across a grueling 16-year fast bowling career of 131 Tests, he never missed a single match due to injury or fitness." }
    ],
    related: ["imran-khan", "sachin-tendulkar", "ms-dhoni"],
    sources: [
      "https://en.wikipedia.org/wiki/Kapil_Dev",
      "https://www.espncricinfo.com/player/kapil-dev-30028"
    ],
    image: "/avatars/kapil-dev.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "javed-miandad",
    name: "Javed Miandad",
    category: "cricketers",
    profession: "Middle-Order Batsman & Coach",
    industry: "International Cricket",
    country: "Pakistan",
    birthDate: "1957-06-12",
    birthPlace: "Karachi, Sindh, Pakistan",
    languages: ["Urdu", "English"],
    nickname: "Street Fighter / Miandad",
    bio: "Mohammad Javed Miandad is a Pakistani former cricketer and coach acclaimed as the greatest batsman Pakistan has ever produced. Renowned for his fierce competitive spirit, tactical street-smartness, and mastery of running between the wickets, he scored 8,832 Test runs and 7,381 ODI runs. His immortal last-ball six against India in Sharjah in 1986 is considered the most dramatic moment in ODI history.",
    famousWorks: [
      { year: 1976, title: "Century on Test debut vs New Zealand at age 19" },
      { year: 1986, title: "Historic Last-Ball Six vs Chetan Sharma in Austral-Asia Cup Final" },
      { year: 1988, title: "Double century (211 vs Australia in Karachi)" },
      { year: 1992, title: "Key batting anchor of Pakistan's 1992 World Cup victory" }
    ],
    awards: [
      "Pride of Performance Award (Government of Pakistan, 1986)",
      "Sitara-e-Imtiaz (Government of Pakistan, 1992)",
      "ICC Cricket Hall of Fame Inductee (2009)",
      "Wisden Cricketer of the Year (1982)"
    ],
    faq: [
      { q: "What happened on the last ball of the 1986 Austral-Asia Cup in Sharjah?", a: "Needing 4 runs to win off the final delivery, Javed Miandad struck a full toss from Chetan Sharma for six to secure an unforgettable victory for Pakistan." },
      { q: "How many World Cups did Javed Miandad play in?", a: "He was the first player in history to appear in six consecutive World Cups (1975 to 1996)." },
      { q: "What was his contribution in the 1992 World Cup final?", a: "He scored a patient and crucial 58, sharing a match-winning 139-run partnership with captain Imran Khan." }
    ],
    related: ["imran-khan", "wasim-akram", "inzamam-ul-haq"],
    sources: [
      "https://en.wikipedia.org/wiki/Javed_Miandad",
      "https://www.espncricinfo.com/player/javed-miandad-41300"
    ],
    image: "/avatars/javed-miandad.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "inzamam-ul-haq",
    name: "Inzamam-ul-Haq",
    category: "cricketers",
    profession: "Middle-Order Batsman & Former Captain",
    industry: "International Cricket",
    country: "Pakistan",
    birthDate: "1970-03-03",
    birthPlace: "Multan, Punjab, Pakistan",
    languages: ["Urdu", "Punjabi", "English"],
    nickname: "Inzi",
    bio: "Inzamam-ul-Haq is a Pakistani cricket coach and former international cricketer who is the leading run-scorer for Pakistan in One Day Internationals (11,739 runs). Gifted with seemingly lazy elegance and extra split-seconds against extreme fast bowling, he burst into international consciousness during the 1992 World Cup semifinals. As captain from 2003 to 2007, his calm authority led Pakistan to numerous landmark victories.",
    famousWorks: [
      { year: 1992, title: "Blistering 60 off 37 balls in 1992 World Cup Semifinal vs New Zealand" },
      { year: 1994, title: "Sensational 58* with 10th wicket Mushtaq Ahmed vs Australia in Karachi" },
      { year: 2002, title: "Triple century (329 vs New Zealand in Lahore)" },
      { year: 2005, title: "Century in his 100th Test match vs India in Bengaluru" }
    ],
    awards: [
      "Sitara-e-Imtiaz (Government of Pakistan, 2005)",
      "Pride of Performance Award (1992)",
      "Leading ODI run-scorer in Pakistan cricket history",
      "Pakistan Cricket Board Hall of Fame"
    ],
    faq: [
      { q: "What was Inzamam-ul-Haq's breakout international innings?", a: "His match-winning 60 off 37 balls against tournament-favorite New Zealand in the 1992 World Cup semifinal in Auckland." },
      { q: "What was his highest score in Test cricket?", a: "329 runs against New Zealand at Gaddafi Stadium, Lahore, in 2002, the second-highest Test score by a Pakistani batsman." },
      { q: "How many international runs did Inzamam score?", a: "He accumulated over 20,500 international runs across Tests and ODIs with 35 centuries." }
    ],
    related: ["wasim-akram", "javed-miandad", "babar-azam"],
    sources: [
      "https://en.wikipedia.org/wiki/Inzamam-ul-Haq",
      "https://www.espncricinfo.com/player/inzamam-ul-haq-40570"
    ],
    image: "/avatars/inzamam-ul-haq.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "waqar-younis",
    name: "Waqar Younis",
    category: "cricketers",
    profession: "Fast Bowler & Coach",
    industry: "International Cricket",
    country: "Pakistan",
    birthDate: "1971-11-16",
    birthPlace: "Burewala, Punjab, Pakistan",
    languages: ["Urdu", "Punjabi", "English"],
    nickname: "The Burewala Express / The King of Reverse Swing",
    bio: "Waqar Younis Maitla is a Pakistani cricket coach and former international cricketer who formed one of the most lethal and feared fast bowling partnerships in cricket history alongside Wasim Akram (the 'Two Ws'). Famous for his toe-crushing reverse-swinging yorkers bowled at over 90 mph, he possesses the best strike rate among any bowler with more than 350 Test wickets (43.4 balls per wicket).",
    famousWorks: [
      { year: 1989, title: "Test debut alongside Sachin Tendulkar in Karachi" },
      { year: 1990, title: "Taking 7 for 76 vs New Zealand in Lahore" },
      { year: 1992, title: "Leading Surrey to English county championship with deadly reverse swing" },
      { year: 2001, title: "Taking 7 for 36 vs England at Headingley in ODI" }
    ],
    awards: [
      "Hilal-e-Imtiaz (Government of Pakistan, 2019)",
      "ICC Cricket Hall of Fame Inductee (2013)",
      "Wisden Cricketer of the Year (1992)",
      "Pride of Performance Award"
    ],
    faq: [
      { q: "What was Waqar Younis's signature delivery?", a: "His lightning-fast, late dipping, reverse-swinging inswinging yorker aimed straight at the batsman's toes." },
      { q: "Who were the 'Two Ws' of Pakistan cricket?", a: "Waqar Younis and Wasim Akram, arguably the most devastating pace bowling tandem in cricket history." },
      { q: "What historic bowling strike rate does Waqar hold?", a: "He holds a career strike rate of 43.4 balls per wicket, the fastest of any bowler with over 350 Test wickets." }
    ],
    related: ["wasim-akram", "shoaib-akhtar", "imran-khan"],
    sources: [
      "https://en.wikipedia.org/wiki/Waqar_Younis",
      "https://www.espncricinfo.com/player/waqar-younis-43577"
    ],
    image: "/avatars/waqar-younis.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "shahid-afridi",
    name: "Shahid Afridi",
    category: "cricketers",
    profession: "All-Rounder & Former Captain",
    industry: "International Cricket & T20",
    country: "Pakistan",
    birthDate: "1977-03-01",
    birthPlace: "Khyber Agency, FATA, Pakistan",
    languages: ["Pashto", "Urdu", "English"],
    nickname: "Boom Boom / Lala",
    bio: "Sahibzada Mohammad Shahid Khan Afridi is a Pakistani former cricketer and captain known globally for his explosive, fearless batting style and sharp leg-spin bowling. In his maiden international innings in 1996, at age 16, he struck a 37-ball ODI century that remained a world record for 17 years. He captained Pakistan to the semifinals of the 2011 World Cup and won the Player of the Tournament at the inaugural 2007 T20 World Cup.",
    famousWorks: [
      { year: 1996, title: "37-ball Century vs Sri Lanka in Nairobi (World Record for 17 years)" },
      { year: 2009, title: "Man of the Match in 2009 ICC World Twenty20 Semifinal & Final" },
      { year: 2011, title: "Leading wicket-taker in 2011 ICC Cricket World Cup (21 wickets)" },
      { year: 2014, title: "Back-to-back sixes vs R Ashwin in Asia Cup thriller vs India" }
    ],
    awards: [
      "Sitara-e-Imtiaz (Government of Pakistan, 2018)",
      "Pride of Performance Award (2010)",
      "Player of the Tournament (Inaugural ICC World Twenty20, 2007)",
      "351 Sixes in ODI cricket (Long-standing world record)"
    ],
    faq: [
      { q: "How fast was Shahid Afridi's record 1996 century?", a: "He reached his century in just 37 balls against Sri Lanka in Nairobi, playing with a bat borrowed from Waqar Younis." },
      { q: "Why was he nicknamed Boom Boom?", a: "Ravi Shastri dubbed him 'Boom Boom' due to his unmatched penchant for sending balls towering out of cricket stadiums." },
      { q: "What was his role in Pakistan winning the 2009 T20 World Cup?", a: "He won Man of the Match in both the semifinal (vs South Africa) and the final at Lord's (vs Sri Lanka), scoring fifty and hitting the winning runs." }
    ],
    related: ["wasim-akram", "shoaib-akhtar", "babar-azam"],
    sources: [
      "https://en.wikipedia.org/wiki/Shahid_Afridi",
      "https://www.espncricinfo.com/player/shahid-afridi-42639"
    ],
    image: "/avatars/shahid-afridi.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "kumar-sangakkara",
    name: "Kumar Sangakkara",
    category: "cricketers",
    profession: "Top-Order Batsman & Wicketkeeper",
    industry: "International Cricket",
    country: "Sri Lanka",
    birthDate: "1977-10-27",
    birthPlace: "Matale, Sri Lanka",
    languages: ["Sinhala", "English"],
    nickname: "Sanga",
    bio: "Kumar Chokshanada Sangakkara is a Sri Lankan cricket commentator and former captain widely recognized as one of the most polished, intelligent, and prolific batsmen in cricket history. He scored 12,400 Test runs at an average of 57.40 and 14,234 ODI runs. In the 2015 Cricket World Cup, he achieved the unprecedented feat of scoring four consecutive centuries in four matches.",
    famousWorks: [
      { year: 2006, title: "World-Record 624-Run Partnership with Mahela Jayawardene vs South Africa" },
      { year: 2011, title: "Delivering the landmark MCC Cowdrey Spirit of Cricket Lecture at Lord's" },
      { year: 2014, title: "Man of the Match in 2014 ICC World Twenty20 Final victory vs India" },
      { year: 2015, title: "Four consecutive ODI centuries in the 2015 Cricket World Cup" }
    ],
    awards: [
      "ICC Cricket Hall of Fame Inductee (2021)",
      "First non-British President of Marylebone Cricket Club (MCC, 2019)",
      "Wisden Leading Cricketer in the World (2012, 2015)",
      "ICC Cricketer of the Year (Sir Garfield Sobers Trophy, 2012)"
    ],
    faq: [
      { q: "What is the highest partnership in Test cricket history?", a: "624 runs between Kumar Sangakkara (287) and Mahela Jayawardene (374) for Sri Lanka against South Africa in Colombo in 2006." },
      { q: "What World Cup record did Sangakkara set in 2015?", a: "He became the first batsman in history to score four consecutive centuries in a single World Cup tournament." },
      { q: "What historic role did he hold at Lord's in 2019?", a: "He became the first non-British person appointed President of the Marylebone Cricket Club (MCC) since its founding in 1787." }
    ],
    related: ["muttiah-muralitharan", "sachin-tendulkar", "brian-lara"],
    sources: [
      "https://en.wikipedia.org/wiki/Kumar_Sangakkara",
      "https://www.espncricinfo.com/player/kumar-sangakkara-50710"
    ],
    image: "/avatars/kumar-sangakkara.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "ab-de-villiers",
    name: "AB de Villiers",
    category: "cricketers",
    profession: "Batsman & Wicketkeeper",
    industry: "International Cricket & T20 Leagues",
    country: "South Africa",
    birthDate: "1984-02-17",
    birthPlace: "Bela-Bela, Limpopo, South Africa",
    languages: ["Afrikaans", "English"],
    nickname: "Mr. 360",
    bio: "Abraham Benjamin de Villiers is a South African former international cricketer celebrated as one of the most innovative and destructive batsmen of all time. Capable of hitting any delivery to any section of the boundary with 360-degree shot-making, he holds the world records for the fastest 50 (16 balls), fastest 100 (31 balls), and fastest 150 (64 balls) in ODI history. He was also a world-class Test batsman averaging over 50.",
    famousWorks: [
      { year: 2012, title: "Epic rear-guard 33 off 220 balls to save Adelaide Test vs Australia" },
      { year: 2015, title: "Fastest ODI century in history (31 balls vs West Indies in Johannesburg)" },
      { year: 2015, title: "Fastest 150 in ODI history (64 balls vs West Indies at World Cup)" },
      { year: 2016, title: "Iconic IPL partnerships with Virat Kohli for Royal Challengers Bangalore" }
    ],
    awards: [
      "ICC Men's ODI Player of the Year (Record 3 times: 2010, 2014, 2015)",
      "ICC Cricket Hall of Fame Inductee (2024)",
      "South African Cricketer of the Year (2014, 2015)",
      "Fastest ODI century in cricket history"
    ],
    faq: [
      { q: "Why is AB de Villiers called 'Mr. 360'?", a: "Due to his supernatural ability to execute unorthodox shots over fine leg, third man, and extra cover, scoring runs anywhere in 360 degrees." },
      { q: "What is the fastest century in ODI cricket history?", a: "AB de Villiers smashed 100 runs off just 31 balls against the West Indies at the Wanderers, Johannesburg, on January 18, 2015." },
      { q: "Could he also play defensive Test cricket?", a: "Yes, famously blocking 220 balls for just 33 runs in Adelaide (2012) and 297 balls for 43 in Delhi (2015) to save Test matches for South Africa." }
    ],
    related: ["virat-kohli", "jacques-kallis", "rohit-sharma"],
    sources: [
      "https://en.wikipedia.org/wiki/AB_de_Villiers",
      "https://www.espncricinfo.com/player/ab-de-villiers-44936"
    ],
    image: "/avatars/ab-de-villiers.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "glenn-mcgrath",
    name: "Glenn McGrath",
    category: "cricketers",
    profession: "Fast Bowler",
    industry: "International Cricket",
    country: "Australia",
    birthDate: "1970-02-09",
    birthPlace: "Dubbo, New South Wales, Australia",
    languages: ["English"],
    nickname: "Pigeon",
    bio: "Glenn Donald McGrath is an Australian former international cricketer regarded as one of the greatest fast bowlers in cricket history. Relying on unerring metronomic accuracy, bounce from a high release, and subtle off-cutters rather than raw pace, he claimed 563 Test wickets and 381 ODI wickets. He won three consecutive Cricket World Cups (1999, 2003, and 2007) with Australia.",
    famousWorks: [
      { year: 1999, title: "1999 Cricket World Cup Champion" },
      { year: 2000, title: "Taking his 300th Test wicket with a hat-trick vs West Indies at WACA" },
      { year: 2003, title: "Best bowling figures in World Cup history (7 for 15 vs Namibia)" },
      { year: 2007, title: "Player of the Tournament in 2007 World Cup (farewell tournament)" }
    ],
    awards: [
      "ICC Cricket Hall of Fame Inductee (2013)",
      "Member of the Order of Australia (AM, 2008)",
      "Wisden Cricketer of the Year (1998)",
      "Allan Border Medal (2000)"
    ],
    faq: [
      { q: "How many World Cups did Glenn McGrath win?", a: "He won three consecutive World Cups (1999, 2003, and 2007) and remains the all-time leading wicket-taker in World Cup history with 71 wickets." },
      { q: "What was Glenn McGrath's greatest bowling attribute?", a: "Unrivaled laser-like consistency on a good length outside off stump, relentlessly probing batsmen into defensive errors." },
      { q: "What charitable organization did he establish?", a: "The McGrath Foundation, co-founded with his late wife Jane, funding breast cancer nurses across Australia." }
    ],
    related: ["shane-warne", "ricky-ponting", "wasim-akram"],
    sources: [
      "https://en.wikipedia.org/wiki/Glenn_McGrath",
      "https://www.espncricinfo.com/player/glenn-mcgrath-6565"
    ],
    image: "/avatars/glenn-mcgrath.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "steve-smith",
    name: "Steve Smith",
    category: "cricketers",
    profession: "Top-Order Batsman",
    industry: "International Cricket",
    country: "Australia",
    birthDate: "1989-06-02",
    birthPlace: "Kogarah, Sydney, New South Wales, Australia",
    languages: ["English"],
    nickname: "Smudge",
    bio: "Steven Peter Devereux Smith is an Australian international cricketer regarded as the best Test batsman since Sir Donald Bradman, possessing an extraordinary Test batting average above 57. Originally selected as a leg-spinner, he revolutionized his game with idiosyncratic twitches, shuffling footwork, and superhuman hand-eye coordination. His 2019 Ashes tour in England, scoring 774 runs in four Tests, is legendary.",
    famousWorks: [
      { year: 2015, title: "ICC Cricket World Cup Champion" },
      { year: 2017, title: "Scoring 3 Test centuries on spin-friendly pitches in India" },
      { year: 2019, title: "Sensational 774 runs in the 2019 Ashes series in England" },
      { year: 2023, title: "ICC World Test Championship & World Cup Champion" }
    ],
    awards: [
      "ICC Men's Test Cricketer of the Decade (2011–2020)",
      "Allan Border Medal (Record 4 times: 2015, 2018, 2021, 2023)",
      "Wisden Leading Cricketer in the World (2018)",
      "Fastest batsman to reach 7,000 and 8,000 Test runs"
    ],
    faq: [
      { q: "Why is Steve Smith compared to Sir Don Bradman?", a: "His peak ICC Test rating reached 947 points in 2017, the second-highest rating in cricket history behind Bradman's 961." },
      { q: "What was his breakthrough Ashes performance in 2019?", a: "Returning after a one-year ban, he scored 144, 142, 92, 211, 82, and 23 to retain the Ashes for Australia on English soil." },
      { q: "How did Steve Smith start his international cricket career?", a: "He debuted in 2010 primarily as a leg-spinner batting at number eight before reinventing himself into a generational number four batsman." }
    ],
    related: ["virat-kohli", "ricky-ponting", "kane-williamson"],
    sources: [
      "https://en.wikipedia.org/wiki/Steve_Smith_(cricketer)",
      "https://www.espncricinfo.com/player/steve-smith-267504"
    ],
    image: "/avatars/steve-smith.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "ben-stokes",
    name: "Ben Stokes",
    category: "cricketers",
    profession: "All-Rounder & Test Captain",
    industry: "International Cricket",
    country: "England",
    birthDate: "1991-06-04",
    birthPlace: "Christchurch, New Zealand",
    languages: ["English"],
    nickname: "Stokesy",
    bio: "Benjamin Andrew Stokes is an English international cricketer and current Test captain renowned for his heroic match-winning performances in high-pressure finals. He was the Player of the Match in the dramatic 2019 ICC Cricket World Cup Final at Lord's and hit an unforgettable 135 not out at Headingley in the 2019 Ashes. Alongside coach Brendon McCullum, he pioneered the revolutionary aggressive 'Bazball' style of Test cricket.",
    famousWorks: [
      { year: 2016, title: "Fastest 250 in Test cricket history (198 balls vs South Africa)" },
      { year: 2019, title: "Man of the Match in 2019 Cricket World Cup Final victory" },
      { year: 2019, title: "The Miracle of Headingley (135* to win by 1 wicket vs Australia)" },
      { year: 2022, title: "Winning fifty in 2022 ICC Men's T20 World Cup Final" }
    ],
    awards: [
      "Officer of the Order of the British Empire (OBE, 2020)",
      "BBC Sports Personality of the Year (2019)",
      "Wisden Leading Cricketer in the World (2020, 2021, 2023)",
      "ICC Player of the Year (Sir Garfield Sobers Trophy, 2019)"
    ],
    faq: [
      { q: "What was the 'Miracle of Headingley'?", a: "In the 2019 Ashes, Ben Stokes scored an unbeaten 135 to guide England to a dramatic 1-wicket victory, adding 76 runs for the last wicket with Jack Leach." },
      { q: "What is 'Bazball'?", a: "The ultra-aggressive, fear-free attacking brand of Test cricket implemented by captain Ben Stokes and head coach Brendon McCullum starting in 2022." },
      { q: "What did Stokes achieve in the 2019 World Cup Final?", a: "He scored an unbeaten 84 to force a historic Super Over against New Zealand, earning Player of the Match honors." }
    ],
    related: ["james-anderson", "virat-kohli", "imran-khan"],
    sources: [
      "https://en.wikipedia.org/wiki/Ben_Stokes",
      "https://www.espncricinfo.com/player/ben-stokes-311158"
    ],
    image: "/avatars/ben-stokes.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "james-anderson",
    name: "James Anderson",
    category: "cricketers",
    profession: "Fast Bowler",
    industry: "International Cricket",
    country: "England",
    birthDate: "1982-07-30",
    birthPlace: "Burnley, Lancashire, England, UK",
    languages: ["English"],
    nickname: "Jimmy / The King of Swing",
    bio: "James Michael Anderson is an English former international cricketer who is the most successful fast bowler in Test cricket history with 704 wickets in 188 Test matches. Acclaimed for his mastery of swing and seam bowling in all conditions, he bowled with pristine bowling mechanics over a remarkable 22-year international career. He is the only fast bowler in cricket history to reach 700 Test wickets.",
    famousWorks: [
      { year: 2010, title: "Ashes series victory in Australia (taking 24 wickets)" },
      { year: 2018, title: "Surpassing Glenn McGrath to become world's leading fast bowling wicket-taker" },
      { year: 2021, title: "Masterclass reverse swing spell vs India in Chennai" },
      { year: 2024, title: "700th Test wicket (dismissing Kuldeep Yadav in Dharamshala)" }
    ],
    awards: [
      "Officer of the Order of the British Empire (OBE, 2015)",
      "Wisden Cricketer of the Year (2009)",
      "All-time record holder for most Test wickets by a fast bowler (704)",
      "BBC Sports Personality of the Year nomination"
    ],
    faq: [
      { q: "How many Test wickets did James Anderson take?", a: "He took 704 Test wickets, third in all-time history behind spin legends Muralitharan (800) and Warne (708)." },
      { q: "How many Test matches did he play?", a: "He played 188 Tests over 22 years, the second-most in cricket history behind Sachin Tendulkar (200)." },
      { q: "What made Anderson's bowling so lethal?", a: "His unmatched skill in swinging the Duke cricket ball late in both directions combined with relentless accuracy on off stump." }
    ],
    related: ["glenn-mcgrath", "wasim-akram", "ben-stokes"],
    sources: [
      "https://en.wikipedia.org/wiki/James_Anderson_(cricketer)",
      "https://www.espncricinfo.com/player/james-anderson-8608"
    ],
    image: "/avatars/james-anderson.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "kane-williamson",
    name: "Kane Williamson",
    category: "cricketers",
    profession: "Top-Order Batsman & Captain",
    industry: "International Cricket",
    country: "New Zealand",
    birthDate: "1990-08-08",
    birthPlace: "Tauranga, Bay of Plenty, New Zealand",
    languages: ["English"],
    nickname: "Kane",
    bio: "Kane Stuart Williamson is a New Zealand international cricketer and former captain widely regarded as New Zealand's greatest batsman and one of the finest sportsman ambassadors in cricket. Renowned for his composure, soft hands, and immaculate technique against elite bowling, he captained New Zealand to victory in the inaugural ICC World Test Championship in 2021 and was Player of the Tournament at the 2019 World Cup.",
    famousWorks: [
      { year: 2010, title: "Test debut century vs India in Ahmedabad" },
      { year: 2015, title: "Match-winning six off Pat Cummins in 2015 World Cup thriller in Auckland" },
      { year: 2019, title: "Player of the Tournament (2019 ICC Cricket World Cup)" },
      { year: 2021, title: "Captaining New Zealand to Inaugural ICC World Test Championship Victory" }
    ],
    awards: [
      "New Zealand Order of Merit (ONZM)",
      "Wisden Leading Cricketer in the World (2015)",
      "ICC Player of the Tournament (World Cup 2019)",
      "Sir Richard Hadlee Medal (Record 5 times)"
    ],
    faq: [
      { q: "What major ICC trophy did Kane Williamson win as captain?", a: "He captained New Zealand to defeat India in the inaugural ICC World Test Championship Final in Southampton in June 2021." },
      { q: "How was he praised after the dramatic 2019 World Cup Final?", a: "His exceptional grace, humility, and sportsmanship after losing the final on a boundary countback won admiration across the globe." },
      { q: "Who are the modern 'Fab Four' batsmen?", a: "Kane Williamson, Virat Kohli, Steve Smith, and Joe Root, considered the four pre-eminent Test batsmen of their era." }
    ],
    related: ["steve-smith", "virat-kohli", "kumar-sangakkara"],
    sources: [
      "https://en.wikipedia.org/wiki/Kane_Williamson",
      "https://www.espncricinfo.com/player/kane-williamson-277906"
    ],
    image: "/avatars/kane-williamson.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "yuvraj-singh",
    name: "Yuvraj Singh",
    category: "cricketers",
    profession: "All-Rounder",
    industry: "International Cricket & IPL",
    country: "India",
    birthDate: "1981-12-12",
    birthPlace: "Chandigarh, India",
    languages: ["Punjabi", "Hindi", "English"],
    nickname: "Yuvi",
    bio: "Yuvraj Singh is an Indian former international cricketer whose heroic all-round performances powered India to two historic World Cup titles: the 2007 ICC World Twenty20 and the 2011 ICC Cricket World Cup. Famed for his flamboyant backlift, brutal striking, and athletic backward point fielding, he hit Stuart Broad for six consecutive sixes in an over in 2007. After winning the 2011 World Cup as Player of the Tournament, he bravely overcame lung cancer.",
    famousWorks: [
      { year: 2002, title: "Historic NatWest Series Final partnership with Mohammad Kaif at Lord's" },
      { year: 2007, title: "Hitting 6 Sixes in an over off Stuart Broad in Durban" },
      { year: 2007, title: "Fastest 50 in T20I cricket history (12 balls)" },
      { year: 2011, title: "Player of the Tournament in 2011 ICC Cricket World Cup (362 runs & 15 wickets)" }
    ],
    awards: [
      "Padma Shri (Government of India, 2014)",
      "Arjuna Award (2012)",
      "Player of the Tournament (ICC Cricket World Cup 2011)",
      "FICCI Most Inspiring Sportsperson of the Year"
    ],
    faq: [
      { q: "How many sixes did Yuvraj Singh hit in one over in 2007?", a: "He hit six consecutive sixes off Stuart Broad of England in Durban during the inaugural ICC World Twenty20 in 2007." },
      { q: "What was his record for the fastest fifty in cricket?", a: "His 12-ball fifty against England in that match stood as the fastest fifty in all international cricket for 16 years." },
      { q: "What cancer foundation did Yuvraj Singh establish?", a: "YouWeCan, a non-profit foundation dedicated to cancer awareness, early screening, and survivor rehabilitation." }
    ],
    related: ["ms-dhoni", "sachin-tendulkar", "virat-kohli"],
    sources: [
      "https://en.wikipedia.org/wiki/Yuvraj_Singh",
      "https://www.espncricinfo.com/player/yuvraj-singh-36084"
    ],
    image: "/avatars/yuvraj-singh.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "saqlain-mushtaq",
    name: "Saqlain Mushtaq",
    category: "cricketers",
    profession: "Off-Spin Bowler & Head Coach",
    industry: "International Cricket",
    country: "Pakistan",
    birthDate: "1976-12-29",
    birthPlace: "Lahore, Punjab, Pakistan",
    languages: ["Urdu", "Punjabi", "English"],
    nickname: "Inventor of the Doosra",
    bio: "Saqlain Mushtaq is a Pakistani cricket coach and former international cricketer celebrated as a pioneer who revolutionized spin bowling by inventing the 'doosra'—an off-spinner delivery that turns away from the right-handed batsman. Taking 208 Test wickets and 288 ODI wickets, he was the fastest bowler to reach 100, 150, 200, and 250 ODI wickets. His match-winning spells against India in Chennai and Delhi in 1999 are legendary.",
    famousWorks: [
      { year: 1996, title: "Inventing and mastering the 'doosra' in international cricket" },
      { year: 1997, title: "Fastest bowler in history to 100 ODI wickets (53 matches)" },
      { year: 1999, title: "Taking 10 wickets in Pakistan's historic Test win vs India in Chennai" },
      { year: 1999, title: "World Cup hat-trick vs Zimbabwe at The Oval" }
    ],
    awards: [
      "Wisden Cricketer of the Year (2000)",
      "Fastest bowler to reach 100, 150, 200, and 250 ODI wickets in history",
      "Two World Cup hat-tricks (1999 vs Zimbabwe and 2003 vs Namibia)"
    ],
    faq: [
      { q: "What is the 'doosra' and who invented it?", a: "The 'doosra' is an off-spinner's delivery bowled with the same arm action that spins away toward the off side, invented and perfected by Saqlain Mushtaq." },
      { q: "What happened in the Chennai Test of 1999?", a: "Saqlain took 10 wickets in the match, including dismissals of Sachin Tendulkar in both innings, sealing a historic 12-run victory for Pakistan." },
      { q: "How many World Cup hat-tricks did Saqlain take?", a: "He is one of only two bowlers in cricket history (with Lasith Malinga) to take two hat-tricks in World Cup tournaments (1999 and 2003)." }
    ],
    related: ["wasim-akram", "muttiah-muralitharan", "shaeen-afridi"],
    sources: [
      "https://en.wikipedia.org/wiki/Saqlain_Mushtaq",
      "https://www.espncricinfo.com/player/saqlain-mushtaq-42656"
    ],
    image: "/avatars/saqlain-mushtaq.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "brett-lee",
    name: "Brett Lee",
    category: "cricketers",
    profession: "Fast Bowler, Musician & Commentator",
    industry: "International Cricket",
    country: "Australia",
    birthDate: "1976-11-08",
    birthPlace: "Wollongong, New South Wales, Australia",
    languages: ["English", "Hindi"],
    nickname: "Binga",
    bio: "Brett Lee is an Australian former international cricketer and commentator celebrated as one of the fastest and most thrilling bowlers the sport has ever seen. Bowling consistently at speeds surpassing 155 km/h (96 mph) with a textbook athletic action and exuberant chainsaw celebrations, he claimed 310 Test wickets and 380 ODI wickets. He won two Cricket World Cups (2003 and 2007) with Australia.",
    famousWorks: [
      { year: 2003, title: "2003 Cricket World Cup Champion (taking 22 wickets at 17.90)" },
      { year: 2005, title: "Iconic 2005 Ashes series in England (including Edgbaston thriller)" },
      { year: 2007, title: "First-ever hat-trick in T20 International history vs Bangladesh" },
      { year: 2008, title: "Allan Border Medal winner as Australia's best player" }
    ],
    awards: [
      "Wisden Cricketer of the Year (2006)",
      "Allan Border Medal (2008)",
      "Australian Cricket Hall of Fame",
      "First hat-trick in ICC Men's T20 World Cup history"
    ],
    faq: [
      { q: "What was Brett Lee's fastest recorded delivery?", a: "He was officially clocked at 161.1 km/h (100.1 mph) against New Zealand in Napier in 2005." },
      { q: "What happened at the conclusion of the 2005 Edgbaston Test?", a: "After England won by just 2 runs, Andrew Flintoff famously consoled a heartbroken Brett Lee on his knees, producing one of cricket's most iconic images of sportsmanship." },
      { q: "What cultural ties does Brett Lee have with India?", a: "He is enormously popular in India, has recorded chart-topping songs with Asha Bhosle, and starred in the Indo-Australian feature film 'UNIndian'." }
    ],
    related: ["shoaib-akhtar", "glenn-mcgrath", "shane-warne"],
    sources: [
      "https://en.wikipedia.org/wiki/Brett_Lee",
      "https://www.espncricinfo.com/player/brett-lee-6298"
    ],
    image: "/avatars/brett-lee.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  }
];

const dest = path.join(__dirname, '..', 'data', 'profiles', 'cricketers.json');
fs.writeFileSync(dest, JSON.stringify(cricketers, null, 2), 'utf8');
console.log(`Successfully wrote ${cricketers.length} profiles to ${dest}`);

