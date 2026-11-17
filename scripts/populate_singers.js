const fs = require('fs');
const path = require('path');

const singers = [
  {
    slug: "michael-jackson",
    name: "Michael Jackson",
    category: "singers",
    profession: "Singer, Songwriter & Dancer",
    industry: "Pop Music & Entertainment",
    country: "United States",
    birthDate: "1958-08-29",
    deathDate: "2009-06-25",
    birthPlace: "Gary, Indiana, USA",
    languages: ["English"],
    nickname: "King of Pop",
    bio: "Michael Jackson was an American singer, songwriter, and dancer regarded as one of the most significant cultural figures of the 20th century. Known for his revolutionary music videos, the moonwalk dance, and signature vocal style, his 1982 album 'Thriller' remains the best-selling album of all time worldwide. His philanthropic contributions and record-shattering stage performances redefined global entertainment.",
    famousWorks: [
      { year: 1979, title: "Off the Wall" },
      { year: 1982, title: "Thriller" },
      { year: 1987, title: "Bad" },
      { year: 1991, title: "Dangerous" },
      { year: 1995, title: "HIStory: Past, Present and Future" }
    ],
    awards: [
      "13 Grammy Awards & Grammy Legend Award",
      "Rock and Roll Hall of Fame Double Inductee",
      "39 Guinness World Records",
      "26 American Music Awards"
    ],
    faq: [
      { q: "Why was Michael Jackson called the King of Pop?", a: "Elizabeth Taylor famously introduced him with that moniker at an awards show in 1989, and his unparalleled commercial and cultural dominance cemented the title globally." },
      { q: "What is the best-selling album of all time?", a: "Michael Jackson's 1982 studio album 'Thriller', with estimated global sales exceeding 70 million copies." },
      { q: "When did Michael Jackson debut the moonwalk?", a: "He debuted his iconic moonwalk during a live performance of 'Billie Jean' on the Motown 25 television special in 1983." }
    ],
    related: ["freddie-mercury", "madonna", "prince"],
    sources: [
      "https://en.wikipedia.org/wiki/Michael_Jackson",
      "https://www.michaeljackson.com"
    ],
    image: "/avatars/michael-jackson.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "freddie-mercury",
    name: "Freddie Mercury",
    category: "singers",
    profession: "Singer, Songwriter & Musician",
    industry: "Rock Music",
    country: "United Kingdom",
    birthDate: "1946-09-05",
    deathDate: "1991-11-24",
    birthPlace: "Stone Town, Sultanate of Zanzibar (Tanzania)",
    languages: ["English", "Gujarati"],
    nickname: "Freddie",
    bio: "Freddie Mercury was a British singer, songwriter, and lead vocalist of the legendary rock band Queen. Renowned for his flamboyant stage persona and remarkable four-octave vocal range, he composed enduring rock masterpieces including 'Bohemian Rhapsody' and 'We Are the Champions'. Mercury's electrifying 1985 performance at Live Aid is widely considered the greatest live concert performance in rock history.",
    famousWorks: [
      { year: 1975, title: "Bohemian Rhapsody" },
      { year: 1977, title: "We Are the Champions / We Will Rock You" },
      { year: 1980, title: "Another One Bites the Dust" },
      { year: 1985, title: "Live Aid Wembley Performance" },
      { year: 1986, title: "A Kind of Magic" }
    ],
    awards: [
      "Brit Award for Outstanding Contribution to Music (Posthumous 1992)",
      "Rock and Roll Hall of Fame Inductee (Queen, 2001)",
      "Songwriters Hall of Fame Inductee (2003)"
    ],
    faq: [
      { q: "What was Freddie Mercury's birth name?", a: "He was born Farrokh Bulsara to Parsi-Indian parents in the Sultanate of Zanzibar." },
      { q: "What was Freddie Mercury's vocal range?", a: "He had a natural baritone voice with a four-octave vocal range extending up to tenor high F." },
      { q: "When was Bohemian Rhapsody released?", a: "It was released on October 31, 1975, on Queen's fourth studio album, 'A Night at the Opera'." }
    ],
    related: ["michael-jackson", "david-bowie", "elton-john"],
    sources: [
      "https://en.wikipedia.org/wiki/Freddie_Mercury",
      "https://www.queenonline.com"
    ],
    image: "/avatars/freddie-mercury.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "madonna",
    name: "Madonna",
    category: "singers",
    profession: "Singer, Songwriter & Actress",
    industry: "Pop Music & Culture",
    country: "United States",
    birthDate: "1958-08-16",
    birthPlace: "Bay City, Michigan, USA",
    languages: ["English"],
    nickname: "Queen of Pop",
    bio: "Madonna Louise Ciccone is an American singer, songwriter, and cultural icon recognized as the best-selling female recording artist of all time. Noted for continuous reinvention and provocative visual imagery, she revolutionized music videos and pushed boundaries of lyrical content in mainstream popular music. Masterpieces like 'Like a Virgin', 'Like a Prayer', and 'Ray of Light' defined generations of pop music.",
    famousWorks: [
      { year: 1984, title: "Like a Virgin" },
      { year: 1986, title: "True Blue" },
      { year: 1989, title: "Like a Prayer" },
      { year: 1998, title: "Ray of Light" },
      { year: 2005, title: "Confessions on a Dance Floor" }
    ],
    awards: [
      "7 Grammy Awards",
      "Rock and Roll Hall of Fame Inductee (2008)",
      "Guinness World Record for Best-Selling Female Recording Artist",
      "Billboard Woman of the Year (2016)"
    ],
    faq: [
      { q: "How many records has Madonna sold?", a: "She has sold more than 300 million records worldwide, holding the Guinness World Record for the best-selling female recording artist." },
      { q: "Which movie won Madonna a Golden Globe Award?", a: "She won the Golden Globe for Best Actress for her lead role in the 1996 musical film 'Evita'." },
      { q: "What was Madonna's breakthrough album?", a: "Her 1984 album 'Like a Virgin' catapulted her to international superstardom." }
    ],
    related: ["michael-jackson", "taylor-swift", "lady-gaga"],
    sources: [
      "https://en.wikipedia.org/wiki/Madonna",
      "https://www.madonna.com"
    ],
    image: "/avatars/madonna.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "taylor-swift",
    name: "Taylor Swift",
    category: "singers",
    profession: "Singer-Songwriter & Record Producer",
    industry: "Pop & Country",
    country: "United States",
    birthDate: "1989-12-13",
    birthPlace: "West Reading, Pennsylvania, USA",
    languages: ["English"],
    nickname: "TayTay",
    bio: "Taylor Swift is an American singer-songwriter whose narrative songwriting and genre transitions have made her one of the most culturally influential artists of the 21st century. She transitioned seamlessly from country music prodigy to international pop phenomenon with chart-dominating albums such as '1989', 'Folklore', and 'Midnights'. Her record-breaking Eras Tour became the highest-grossing concert tour of all time.",
    famousWorks: [
      { year: 2008, title: "Fearless" },
      { year: 2012, title: "Red" },
      { year: 2014, title: "1989" },
      { year: 2020, title: "Folklore" },
      { year: 2022, title: "Midnights" },
      { year: 2024, title: "The Tortured Poets Department" }
    ],
    awards: [
      "14 Grammy Awards (Record 4-time Album of the Year winner)",
      "40 American Music Awards",
      "Time Person of the Year (2023)",
      "Billboard Woman of the Decade (2010s)"
    ],
    faq: [
      { q: "How many Grammy Album of the Year awards has Taylor Swift won?", a: "She is the only artist in history to win Album of the Year four times: for Fearless, 1989, Folklore, and Midnights." },
      { q: "What was the significance of the Eras Tour?", a: "The Eras Tour became the first concert tour in history to surpass $1 billion in revenue, celebrating all musical eras of her career." },
      { q: "At what age did Taylor Swift sign her first record deal?", a: "She signed a music publishing deal with Sony/ATV at age 14 and a record deal with Big Machine Records at age 15." }
    ],
    related: ["adele", "beyonce", "ed-sheeran"],
    sources: [
      "https://en.wikipedia.org/wiki/Taylor_Swift",
      "https://www.taylorswift.com"
    ],
    image: "/avatars/taylor-swift.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "elvis-presley",
    name: "Elvis Presley",
    category: "singers",
    profession: "Singer & Actor",
    industry: "Rock and Roll & Rockabilly",
    country: "United States",
    birthDate: "1935-01-08",
    deathDate: "1977-08-16",
    birthPlace: "Tupelo, Mississippi, USA",
    languages: ["English"],
    nickname: "The King of Rock and Roll",
    bio: "Elvis Presley was an American singer and actor universally known as the 'King of Rock and Roll'. He is regarded as one of the most significant cultural icons of the 20th century, fusing country and African-American rhythm and blues to popularize rockabilly. His explosive television appearances, provocative hip movements, and timeless hits like 'Hound Dog' and 'Jailhouse Rock' revolutionized popular culture.",
    famousWorks: [
      { year: 1956, title: "Heartbreak Hotel" },
      { year: 1956, title: "Hound Dog / Don't Be Cruel" },
      { year: 1957, title: "Jailhouse Rock" },
      { year: 1968, title: "'68 Comeback Special" },
      { year: 1969, title: "Suspicious Minds" }
    ],
    awards: [
      "3 Grammy Awards & Grammy Lifetime Achievement Award (1971)",
      "Rock and Roll Hall of Fame Inductee (1986 inaugural class)",
      "Presidential Medal of Freedom (Posthumous 2018)"
    ],
    faq: [
      { q: "Where was Elvis Presley's home located?", a: "His legendary estate, Graceland, is located in Memphis, Tennessee, and is now an iconic museum." },
      { q: "What was Elvis Presley's first recorded single?", a: "His first commercially released single was 'That's All Right' recorded at Sun Studio in Memphis in 1954." },
      { q: "How many films did Elvis Presley star in?", a: "He starred in 31 feature films and two theatrical concert documentary films." }
    ],
    related: ["john-lennon", "paul-mccartney", "frank-sinatra"],
    sources: [
      "https://en.wikipedia.org/wiki/Elvis_Presley",
      "https://www.graceland.com"
    ],
    image: "/avatars/elvis-presley.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "adele",
    name: "Adele",
    category: "singers",
    profession: "Singer-Songwriter",
    industry: "Soul & Pop Music",
    country: "United Kingdom",
    birthDate: "1988-05-05",
    birthPlace: "Tottenham, London, UK",
    languages: ["English"],
    nickname: "Adele",
    bio: "Adele Laurie Blue Adkins is an English singer and songwriter acclaimed for her powerful mezzo-soprano vocals and emotionally resonant ballads. Graduating from the BRIT School, her studio albums '19', '21', '25', and '30' achieved monumental commercial and critical acclaim worldwide. Her single 'Rolling in the Deep' and Bond theme 'Skyfall' earned her global admiration and multiple industry accolades.",
    famousWorks: [
      { year: 2008, title: "19 (including 'Chasing Pavements')" },
      { year: 2011, title: "21 (including 'Rolling in the Deep' & 'Someone Like You')" },
      { year: 2012, title: "Skyfall (James Bond Theme)" },
      { year: 2015, title: "25 (including 'Hello')" },
      { year: 2021, title: "30 (including 'Easy on Me')" }
    ],
    awards: [
      "16 Grammy Awards",
      "Academy Award (Oscar) for Best Original Song ('Skyfall')",
      "Golden Globe Award ('Skyfall')",
      "12 Brit Awards"
    ],
    faq: [
      { q: "What is Adele's best-selling album?", a: "Her 2011 album '21' sold over 31 million copies worldwide, becoming the best-selling album of the 21st century." },
      { q: "Why are Adele's albums titled after numbers?", a: "Each album title represents her age during the pivotal period in which the songs were composed." },
      { q: "Did Adele win an Oscar?", a: "Yes, she won the Academy Award for Best Original Song in 2013 for the James Bond theme 'Skyfall'." }
    ],
    related: ["taylor-swift", "beyonce", "celine-dion"],
    sources: [
      "https://en.wikipedia.org/wiki/Adele",
      "https://www.adele.com"
    ],
    image: "/avatars/adele.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "beyonce",
    name: "Beyoncé",
    category: "singers",
    profession: "Singer, Songwriter, Producer & Actress",
    industry: "R&B, Pop & Visual Album Arts",
    country: "United States",
    birthDate: "1981-09-04",
    birthPlace: "Houston, Texas, USA",
    languages: ["English"],
    nickname: "Queen Bey",
    bio: "Beyoncé Giselle Knowles-Carter is an American singer, songwriter, and businesswoman hailed as one of the greatest performers of her generation. Rising to fame as the lead singer of Destiny's Child, her solo career produced defining cultural albums including 'Dangerously in Love', 'Lemonade', and 'Renaissance'. She holds the record as the most-awarded artist in Grammy history.",
    famousWorks: [
      { year: 2003, title: "Dangerously in Love (including 'Crazy in Love')" },
      { year: 2006, title: "B'Day (including 'Irreplaceable')" },
      { year: 2008, title: "I Am... Sasha Fierce (including 'Single Ladies')" },
      { year: 2016, title: "Lemonade" },
      { year: 2022, title: "Renaissance" },
      { year: 2024, title: "Cowboy Carter" }
    ],
    awards: [
      "32 Grammy Awards (All-time most awarded artist in Grammy history)",
      "29 MTV Video Music Awards",
      "Billboard Millennium Award (2011)",
      "NAACP Image Award for Entertainer of the Year"
    ],
    faq: [
      { q: "Who holds the record for most Grammy wins in history?", a: "Beyoncé holds the all-time record with 32 Grammy Awards won across solo work, collaborations, and Destiny's Child." },
      { q: "What was Beyoncé's breakthrough girl group?", a: "Destiny's Child, one of the best-selling female groups in recording history with hits like 'Say My Name' and 'Survivor'." },
      { q: "What was the concept behind Lemonade?", a: "Released in 2016, Lemonade was a visual album exploring generational trauma, infidelity, and African-American womanhood." }
    ],
    related: ["taylor-swift", "rihanna", "adele"],
    sources: [
      "https://en.wikipedia.org/wiki/Beyonc%C3%A9",
      "https://www.beyonce.com"
    ],
    image: "/avatars/beyonce.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "nusrat-fateh-ali-khan",
    name: "Nusrat Fateh Ali Khan",
    category: "singers",
    profession: "Qawwali Singer & Composer",
    industry: "Sufi Music & World Music",
    country: "Pakistan",
    birthDate: "1948-10-13",
    deathDate: "1997-08-16",
    birthPlace: "Faisalabad, Punjab, Pakistan",
    languages: ["Urdu", "Punjabi", "Persian"],
    nickname: "Shahenshah-e-Qawwali (Emperor of Qawwali)",
    bio: "Ustad Nusrat Fateh Ali Khan was a Pakistani vocalist, musician, and music director primarily known for Qawwali, a form of Sufi devotional music. Possessing an extraordinary vocal range and intense improvisational stamina, he performed for consecutive hours in ecstatic trance-like states. He introduced traditional Sufi devotional music to international audiences through collaborations with Peter Gabriel and Eddie Vedder.",
    famousWorks: [
      { year: 1988, title: "Ye Jo Halka Halka Suroor Hai" },
      { year: 1990, title: "Mustt Mustt (with Peter Gabriel / Michael Brook)" },
      { year: 1992, title: "Shahbaaz Qalandar" },
      { year: 1995, title: "Dead Man Walking Soundtrack (with Eddie Vedder)" },
      { year: 1996, title: "Night Song" }
    ],
    awards: [
      "Pride of Performance Award (Government of Pakistan, 1987)",
      "UNESCO Music Prize (1995)",
      "Grand Prix des Amériques (Montreal World Film Festival, 1996)",
      "Inducted into Time Magazine's list of '60 Years of Asian Heroes'"
    ],
    faq: [
      { q: "What does Shahenshah-e-Qawwali mean?", a: "It is an honorific Urdu title meaning 'The Emperor of Qawwali', recognized throughout the Indian subcontinent and worldwide." },
      { q: "Which international Hollywood film featured Nusrat Fateh Ali Khan?", a: "His vocals featured prominently in Oliver Stone's 'Natural Born Killers' and Tim Robbins' 'Dead Man Walking'." },
      { q: "Who was his musical successor?", a: "His nephew, Ustad Rahat Fateh Ali Khan, was trained directly by him and continues the musical legacy." }
    ],
    related: ["lata-mangeshkar", "mohammad-rafi", "atif-aslam"],
    sources: [
      "https://en.wikipedia.org/wiki/Nusrat_Fateh_Ali_Khan",
      "https://www.britannica.com/biography/Nusrat-Fateh-Ali-Khan"
    ],
    image: "/avatars/nusrat-fateh-ali-khan.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "lata-mangeshkar",
    name: "Lata Mangeshkar",
    category: "singers",
    profession: "Playback Singer & Music Director",
    industry: "Indian Cinema (Bollywood)",
    country: "India",
    birthDate: "1929-09-28",
    deathDate: "2022-02-06",
    birthPlace: "Indore, Central India Agency (Madhya Pradesh, India)",
    languages: ["Hindi", "Marathi", "Bengali", "Urdu"],
    nickname: "Nightingale of India",
    bio: "Lata Mangeshkar was an iconic Indian playback singer whose career spanned over seven decades across more than thirty-six regional and foreign languages. Regarded as one of the most revered and influential vocalists in the history of Indian music, she recorded thousands of songs for classic Hindi cinema. In 2001, she received India's highest civilian honor, the Bharat Ratna, in recognition of her peerless cultural legacy.",
    famousWorks: [
      { year: 1949, title: "Aayega Aanewala (Mahal)" },
      { year: 1960, title: "Pyar Kiya To Darna Kya (Mughal-e-Azam)" },
      { year: 1963, title: "Aye Mere Watan Ke Logo (Patriotic Anthem)" },
      { year: 1965, title: "Lag Jaa Gale (Woh Kaun Thi?)" },
      { year: 1995, title: "Tujhe Dekha To (Dilwale Dulhania Le Jayenge)" }
    ],
    awards: [
      "Bharat Ratna (India's Highest Civilian Award, 2001)",
      "Padma Vibhushan (1999) & Padma Bhushan (1969)",
      "Dadasaheb Phalke Award (1989)",
      "Officer of the National Order of the Legion of Honour (France, 2007)"
    ],
    faq: [
      { q: "Why was Lata Mangeshkar called the Nightingale of India?", a: "Her crystal-clear pitch, flawless diction, and emotional resonance earned her the title 'Queen of Melody' and 'Nightingale of India'." },
      { q: "Which song brought Prime Minister Jawaharlal Nehru to tears?", a: "Her live rendition of the patriotic tribute 'Aye Mere Watan Ke Logo' in January 1963 moved Prime Minister Nehru to tears." },
      { q: "How many songs did Lata Mangeshkar record?", a: "She recorded an estimated 25,000 to 30,000 songs across more than 36 languages throughout her 70-year career." }
    ],
    related: ["mohammad-rafi", "kishore-kumar", "nusrat-fateh-ali-khan"],
    sources: [
      "https://en.wikipedia.org/wiki/Lata_Mangeshkar",
      "https://www.britannica.com/biography/Lata-Mangeshkar"
    ],
    image: "/avatars/lata-mangeshkar.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "bob-marley",
    name: "Bob Marley",
    category: "singers",
    profession: "Singer, Songwriter & Musician",
    industry: "Reggae & Rastafari Movement",
    country: "Jamaica",
    birthDate: "1945-02-06",
    deathDate: "1981-05-11",
    birthPlace: "Nine Mile, Saint Ann Parish, Jamaica",
    languages: ["English", "Jamaican Patois"],
    nickname: "Tuff Gong",
    bio: "Robert Nesta Marley was a Jamaican singer, songwriter, and guitarist who popularized reggae music worldwide and became a global symbol of peace and resistance. Infusing his music with spirituality and Rastafari teachings, his work with The Wailers produced timeless anthems like 'No Woman, No Cry' and 'Redemption Song'. His compilation album 'Legend' is the best-selling reggae album in history.",
    famousWorks: [
      { year: 1973, title: "Catch a Fire" },
      { year: 1974, title: "Burnin' (including 'I Shot the Sheriff')" },
      { year: 1975, title: "No Woman, No Cry (Live)" },
      { year: 1977, title: "Exodus (including 'Jamming' & 'One Love')" },
      { year: 1980, title: "Redemption Song" }
    ],
    awards: [
      "Peace Medal of the Third World from the United Nations (1978)",
      "Jamaican Order of Merit (1981)",
      "Rock and Roll Hall of Fame Inductee (1994)",
      "Grammy Lifetime Achievement Award (2001)"
    ],
    faq: [
      { q: "What was Bob Marley's political impact in Jamaica?", a: "During intense civil unrest in 1978, Marley joined hands with opposing political leaders Michael Manley and Edward Seaga on stage at the One Love Peace Concert." },
      { q: "What is Bob Marley's best-selling album?", a: "His 1984 greatest hits compilation 'Legend' has sold more than 28 million copies worldwide." },
      { q: "What was Bob Marley's band called?", a: "His legendary group was Bob Marley and the Wailers, featuring Peter Tosh and Bunny Wailer." }
    ],
    related: ["john-lennon", "freddie-mercury", "aretha-franklin"],
    sources: [
      "https://en.wikipedia.org/wiki/Bob_Marley",
      "https://www.bobmarley.com"
    ],
    image: "/avatars/bob-marley.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "whitney-houston",
    name: "Whitney Houston",
    category: "singers",
    profession: "Singer & Actress",
    industry: "R&B, Pop & Soul",
    country: "United States",
    birthDate: "1963-08-09",
    deathDate: "2012-02-11",
    birthPlace: "Newark, New Jersey, USA",
    languages: ["English"],
    nickname: "The Voice",
    bio: "Whitney Elizabeth Houston was an American singer and actress certified as one of the best-selling music artists of all time with over 220 million records sold worldwide. Renowned for her powerful, soaring mezzo-soprano voice and immaculate vocal control, she earned the moniker 'The Voice'. Her signature cover of Dolly Parton's 'I Will Always Love You' from the film 'The Bodyguard' remains one of the greatest vocal feats in recorded history.",
    famousWorks: [
      { year: 1985, title: "Whitney Houston (debut album)" },
      { year: 1987, title: "Whitney (including 'I Wanna Dance with Somebody')" },
      { year: 1992, title: "The Bodyguard Soundtrack ('I Will Always Love You')" },
      { year: 1998, title: "My Love Is Your Love" },
      { year: 2009, title: "I Look to You" }
    ],
    awards: [
      "6 Grammy Awards & 2 Emmy Awards",
      "22 American Music Awards",
      "Rock and Roll Hall of Fame Inductee (2020)",
      "Guinness World Record for Most Awarded Female Artist of All Time"
    ],
    faq: [
      { q: "What was Whitney Houston's most famous song?", a: "Her rendition of 'I Will Always Love You' from The Bodyguard spent 14 weeks at number one on the Billboard Hot 100." },
      { q: "Why was Whitney Houston called 'The Voice'?", a: "Oprah Winfrey and music critics bestowed the title upon her due to her flawless pitch, dramatic vocal range, and peerless vocal agility." },
      { q: "Which film marked her acting debut?", a: "She made her acting debut alongside Kevin Costner in the 1992 romantic thriller 'The Bodyguard'." }
    ],
    related: ["aretha-franklin", "mariah-carey", "celine-dion"],
    sources: [
      "https://en.wikipedia.org/wiki/Whitney_Houston",
      "https://www.whitneyhouston.com"
    ],
    image: "/avatars/whitney-houston.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "john-lennon",
    name: "John Lennon",
    category: "singers",
    profession: "Singer, Songwriter & Peace Activist",
    industry: "Rock & Peace Movement",
    country: "United Kingdom",
    birthDate: "1940-10-09",
    deathDate: "1980-12-08",
    birthPlace: "Liverpool, England, UK",
    languages: ["English"],
    nickname: "Lennon",
    bio: "John Winston Ono Lennon was an English singer, songwriter, and peace activist who co-founded the Beatles, the most commercially successful band in popular music history. His songwriting partnership with Paul McCartney remains the most celebrated in music history. Lennon's solo career produced universal anthems of peace and unity, most notably the immortal song 'Imagine'.",
    famousWorks: [
      { year: 1967, title: "Sgt. Pepper's Lonely Hearts Club Band (with The Beatles)" },
      { year: 1969, title: "Give Peace a Chance" },
      { year: 1970, title: "John Lennon/Plastic Ono Band" },
      { year: 1971, title: "Imagine" },
      { year: 1980, title: "Double Fantasy" }
    ],
    awards: [
      "Rock and Roll Hall of Fame Double Inductee (The Beatles 1988, Solo 1994)",
      "Songwriters Hall of Fame Inductee (1987)",
      "Grammy Award for Album of the Year ('Double Fantasy', 1981)"
    ],
    faq: [
      { q: "What is John Lennon's most iconic solo song?", a: "'Imagine', released in 1971, which has become a worldwide anthem for peace and human unity." },
      { q: "Who was John Lennon's primary songwriting partner?", a: "Paul McCartney; their 'Lennon-McCartney' collaboration wrote over 180 songs for The Beatles." },
      { q: "When did John Lennon pass away?", a: "He was tragically assassinated outside his Manhattan apartment, the Dakota, on December 8, 1980, by Mark David Chapman." }
    ],
    related: ["paul-mccartney", "bob-marley", "david-bowie"],
    sources: [
      "https://en.wikipedia.org/wiki/John_Lennon",
      "https://www.johnlennon.com"
    ],
    image: "/avatars/john-lennon.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "paul-mccartney",
    name: "Paul McCartney",
    category: "singers",
    profession: "Singer-Songwriter, Bassist & Composer",
    industry: "Rock & Pop Music",
    country: "United Kingdom",
    birthDate: "1942-06-18",
    birthPlace: "Liverpool, England, UK",
    languages: ["English"],
    nickname: "Macca",
    bio: "Sir James Paul McCartney is an English singer, songwriter, and musician who gained worldwide fame as bassist and co-lead vocalist of the Beatles. Known for his melodic basslines, versatile vocal delivery, and prolific songwriting, he composed the immortal classic 'Yesterday', one of the most covered songs in history. Following the Beatles, he formed Wings and continued an extraordinary solo career spanning six decades.",
    famousWorks: [
      { year: 1965, title: "Yesterday (with The Beatles)" },
      { year: 1968, title: "Hey Jude (with The Beatles)" },
      { year: 1970, title: "Let It Be (with The Beatles)" },
      { year: 1973, title: "Band on the Run (with Wings)" },
      { year: 1973, title: "Live and Let Die (James Bond Theme)" }
    ],
    awards: [
      "Knight Bachelor conferred by Queen Elizabeth II (1997)",
      "18 Grammy Awards",
      "Kennedy Center Honors (2010)",
      "Rock and Roll Hall of Fame Double Inductee (The Beatles 1988, Solo 1999)"
    ],
    faq: [
      { q: "What is the most covered pop song in music history?", a: "Paul McCartney's 1965 ballad 'Yesterday', covered by more than 2,200 recorded artists." },
      { q: "What was the name of Paul McCartney's band after The Beatles?", a: "Wings, formed with his wife Linda McCartney and Denny Laine in 1971." },
      { q: "Was Paul McCartney knighted?", a: "Yes, he was knighted by Queen Elizabeth II in 1997 for his exceptional services to music." }
    ],
    related: ["john-lennon", "elton-john", "freddie-mercury"],
    sources: [
      "https://en.wikipedia.org/wiki/Paul_McCartney",
      "https://www.paulmccartney.com"
    ],
    image: "/avatars/paul-mccartney.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "frank-sinatra",
    name: "Frank Sinatra",
    category: "singers",
    profession: "Singer, Actor & Producer",
    industry: "Traditional Pop, Big Band & Swing",
    country: "United States",
    birthDate: "1915-12-12",
    deathDate: "1998-05-14",
    birthPlace: "Hoboken, New Jersey, USA",
    languages: ["English"],
    nickname: "Ol' Blue Eyes / The Chairman of the Board",
    bio: "Francis Albert Sinatra was an American singer and actor who was one of the most popular and influential musical artists of the 20th century. With sales of 150 million records worldwide, he mastered swing and easy listening with flawless phrasing and deep emotional timing. As the leader of the legendary 'Rat Pack', he came to define cool mid-century American entertainment and cinema.",
    famousWorks: [
      { year: 1953, title: "From Here to Eternity (Film)" },
      { year: 1956, title: "Songs for Swingin' Lovers!" },
      { year: 1966, title: "Strangers in the Night" },
      { year: 1969, title: "My Way" },
      { year: 1979, title: "Theme from New York, New York" }
    ],
    awards: [
      "Academy Award (Oscar) for Best Supporting Actor ('From Here to Eternity', 1953)",
      "11 Grammy Awards & Grammy Lifetime Achievement Award (1965)",
      "Presidential Medal of Freedom (1985)",
      "Congressional Gold Medal (1997)"
    ],
    faq: [
      { q: "What were Frank Sinatra's most famous nicknames?", a: "He was widely known as 'Ol' Blue Eyes' and 'The Chairman of the Board'." },
      { q: "What was the Rat Pack?", a: "A legendary group of entertainers in the 1950s and 60s consisting of Frank Sinatra, Dean Martin, Sammy Davis Jr., Peter Lawford, and Joey Bishop." },
      { q: "Did Frank Sinatra win an Oscar?", a: "Yes, he won the 1953 Academy Award for Best Supporting Actor for his role as Private Angelo Maggio in 'From Here to Eternity'." }
    ],
    related: ["elvis-presley", "elton-john", "michael-jackson"],
    sources: [
      "https://en.wikipedia.org/wiki/Frank_Sinatra",
      "https://www.sinatrafamily.com"
    ],
    image: "/avatars/frank-sinatra.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "eminem",
    name: "Eminem",
    category: "singers",
    profession: "Rapper, Songwriter & Record Producer",
    industry: "Hip-Hop & Rap",
    country: "United States",
    birthDate: "1972-10-17",
    birthPlace: "St. Joseph, Missouri, USA",
    languages: ["English"],
    nickname: "Slim Shady",
    bio: "Marshall Bruce Mathers III, known professionally as Eminem, is an American rapper, songwriter, and record producer recognized as one of the greatest rappers of all time. Credited with popularizing hip-hop in Middle America and breaking racial barriers in the genre, his rapid-fire lyrical complexity and dark humor dominated the 2000s. He was the best-selling music artist in the United States of the 2000s.",
    famousWorks: [
      { year: 1999, title: "The Slim Shady LP" },
      { year: 2000, title: "The Marshall Mathers LP" },
      { year: 2002, title: "The Eminem Show" },
      { year: 2002, title: "Lose Yourself (from '8 Mile')" },
      { year: 2010, title: "Recovery" }
    ],
    awards: [
      "15 Grammy Awards",
      "Academy Award (Oscar) for Best Original Song ('Lose Yourself', 2003)",
      "Rock and Roll Hall of Fame Inductee (2022)",
      "Billboard Artist of the Decade (2000s)"
    ],
    faq: [
      { q: "What made Eminem's Oscar win historic?", a: "'Lose Yourself' was the first hip-hop song in history to win the Academy Award for Best Original Song." },
      { q: "What is Eminem's alter ego called?", a: "Slim Shady, through which he channeled violent, satirical, and darkly comedic personas." },
      { q: "Who discovered Eminem?", a: "Legendary producer Dr. Dre heard Eminem's demo tape in 1997 and immediately signed him to Aftermath Entertainment." }
    ],
    related: ["michael-jackson", "rihanna", "taylor-swift"],
    sources: [
      "https://en.wikipedia.org/wiki/Eminem",
      "https://www.eminem.com"
    ],
    image: "/avatars/eminem.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "rihanna",
    name: "Rihanna",
    category: "singers",
    profession: "Singer, Businesswoman & Fashion Designer",
    industry: "Pop, R&B & Cosmetics",
    country: "Barbados",
    birthDate: "1988-02-20",
    birthPlace: "Saint Michael, Barbados",
    languages: ["English"],
    nickname: "RiRi",
    bio: "Robyn Rihanna Fenty is a Barbadian singer, businesswoman, and actress who is the second-best-selling female music artist of all time. Known for embracing versatile musical styles and reinventing her image, hits like 'Umbrella', 'Diamonds', and 'Work' earned her 14 Billboard Hot 100 number-one singles. She also founded the globally transformative beauty and fashion empires Fenty Beauty and Savage X Fenty.",
    famousWorks: [
      { year: 2007, title: "Good Girl Gone Bad (including 'Umbrella')" },
      { year: 2010, title: "Loud (including 'Only Girl in the World')" },
      { year: 2012, title: "Unapologetic (including 'Diamonds')" },
      { year: 2016, title: "Anti (including 'Work')" },
      { year: 2023, title: "Super Bowl LVII Halftime Show" }
    ],
    awards: [
      "9 Grammy Awards",
      "13 American Music Awards & 12 Billboard Music Awards",
      "National Hero of Barbados (conferred 2021)",
      "Forbes Billionaire & Self-Made Woman"
    ],
    faq: [
      { q: "What national honor did Rihanna receive in Barbados?", a: "In November 2021, when Barbados became a republic, Prime Minister Mia Mottley named her a National Hero of Barbados with the title 'The Right Excellent'." },
      { q: "What businesses did Rihanna create?", a: "She founded Fenty Beauty in 2017 (famed for pioneering 40 foundation shades) and Savage X Fenty lingerie." },
      { q: "How many number-one Billboard Hot 100 hits does Rihanna have?", a: "She has achieved 14 number-one singles, ranking third all-time behind The Beatles and Mariah Carey." }
    ],
    related: ["beyonce", "taylor-swift", "eminem"],
    sources: [
      "https://en.wikipedia.org/wiki/Rihanna",
      "https://www.rihanna.com"
    ],
    image: "/avatars/rihanna.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "ed-sheeran",
    name: "Ed Sheeran",
    category: "singers",
    profession: "Singer-Songwriter & Musician",
    industry: "Pop & Folk Pop",
    country: "United Kingdom",
    birthDate: "1991-02-17",
    birthPlace: "Halifax, West Yorkshire, England, UK",
    languages: ["English"],
    nickname: "Teddy",
    bio: "Edward Christopher Sheeran is an English singer-songwriter who rose from busking and independent club gigs to selling over 150 million records worldwide. Armed with an acoustic guitar and a custom loop pedal, he crafts irresistible pop-folk anthems including 'Thinking Out Loud' and 'Shape of You'. His mathematically titled albums have broken global streaming and concert attendance records.",
    famousWorks: [
      { year: 2011, title: "+ (Plus, including 'The A Team')" },
      { year: 2014, title: "x (Multiply, including 'Thinking Out Loud')" },
      { year: 2017, title: "÷ (Divide, including 'Shape of You' & 'Perfect')" },
      { year: 2021, title: "= (Equals, including 'Bad Habits')" },
      { year: 2023, title: "- (Subtract)" }
    ],
    awards: [
      "4 Grammy Awards",
      "Member of the Order of the British Empire (MBE, 2017)",
      "5 Brit Awards & 6 Billboard Music Awards",
      "Ivor Novello Award for Songwriter of the Year"
    ],
    faq: [
      { q: "What is the most streamed song on Spotify?", a: "'Shape of You' was the first song to reach 3 billion streams on Spotify and remains one of the most streamed tracks in history." },
      { q: "What makes Ed Sheeran's live performances unique?", a: "He performs solo on stadiums worldwide using only acoustic guitars and a custom multi-track loop pedal without a backing band." },
      { q: "Why are his albums named after math symbols?", a: "He envisioned a five-album math-themed series (+, x, ÷, =, -) to create a unified thematic body of work." }
    ],
    related: ["taylor-swift", "adele", "elton-john"],
    sources: [
      "https://en.wikipedia.org/wiki/Ed_Sheeran",
      "https://www.edsheeran.com"
    ],
    image: "/avatars/ed-sheeran.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "celine-dion",
    name: "Celine Dion",
    category: "singers",
    profession: "Singer",
    industry: "Pop & Power Ballads",
    country: "Canada",
    birthDate: "1968-03-30",
    birthPlace: "Charlemagne, Quebec, Canada",
    languages: ["French", "English"],
    nickname: "Queen of Power Ballads",
    bio: "Céline Marie Claudette Dion is a Canadian singer acclaimed for her powerful, technically skilled vocals and soaring soprano range. Having emerged as a teen star in the francophone world, she achieved universal stardom with titanic anthems like 'The Power of Love', 'Because You Loved Me', and the Titanic theme 'My Heart Will Go On'. She is the best-selling Canadian recording artist of all time.",
    famousWorks: [
      { year: 1993, title: "The Colour of My Love" },
      { year: 1996, title: "Falling into You" },
      { year: 1997, title: "My Heart Will Go On (Titanic Theme)" },
      { year: 1997, title: "Let's Talk About Love" },
      { year: 2002, title: "A New Day Has Come" }
    ],
    awards: [
      "5 Grammy Awards",
      "Academy Award (Oscar) for Best Original Song ('My Heart Will Go On')",
      "Companion of the Order of Canada (2008)",
      "Chavalier of the French Legion of Honour"
    ],
    faq: [
      { q: "Which song is Celine Dion most famous for?", a: "'My Heart Will Go On', the love theme from James Cameron's 1997 blockbuster movie Titanic, which won both an Oscar and four Grammys." },
      { q: "In which languages does Celine Dion primarily sing?", a: "She has recorded successful multi-platinum albums in both French and English." },
      { q: "What was her milestone Las Vegas residency?", a: "'A New Day...' at Caesars Palace in Las Vegas, which became the most successful residency in music history." }
    ],
    related: ["whitney-houston", "adele", "shakira"],
    sources: [
      "https://en.wikipedia.org/wiki/Celine_Dion",
      "https://www.celinedion.com"
    ],
    image: "/avatars/celine-dion.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "aretha-franklin",
    name: "Aretha Franklin",
    category: "singers",
    profession: "Singer, Songwriter & Pianist",
    industry: "Soul, R&B & Gospel",
    country: "United States",
    birthDate: "1942-03-25",
    deathDate: "2018-08-16",
    birthPlace: "Memphis, Tennessee, USA",
    languages: ["English"],
    nickname: "Queen of Soul",
    bio: "Aretha Louise Franklin was an American singer, songwriter, and pianist globally revered as the 'Queen of Soul'. Beginning her career singing gospel at her father's church in Detroit, she became a civil rights champion and musical titan with anthems like 'Respect' and 'Natural Woman'. She was the first woman inducted into the Rock and Roll Hall of Fame.",
    famousWorks: [
      { year: 1967, title: "Respect" },
      { year: 1967, title: "(You Make Me Feel Like) A Natural Woman" },
      { year: 1968, title: "Chain of Fools" },
      { year: 1972, title: "Amazing Grace (Live Gospel Album)" },
      { year: 1985, title: "Freeway of Love" }
    ],
    awards: [
      "18 Grammy Awards & Grammy Lifetime Achievement Award (1994)",
      "First woman inducted into the Rock and Roll Hall of Fame (1987)",
      "Presidential Medal of Freedom (2005)",
      "Pulitzer Prize Special Citation (Posthumous 2019)"
    ],
    faq: [
      { q: "Why was Aretha Franklin called the Queen of Soul?", a: "Her unmatched vocal power, passionate gospel roots, and transformative soul classics earned her the undisputed coronation as Queen of Soul in the late 1960s." },
      { q: "What historical barrier did Aretha Franklin break in 1987?", a: "She became the first woman ever inducted into the Rock and Roll Hall of Fame." },
      { q: "At whose presidential inauguration did she perform?", a: "She performed a moving rendition of 'My Country, 'Tis of Thee' at the 2009 inauguration of President Barack Obama." }
    ],
    related: ["whitney-houston", "stevie-wonder", "frank-sinatra"],
    sources: [
      "https://en.wikipedia.org/wiki/Aretha_Franklin",
      "https://www.britannica.com/biography/Aretha-Franklin"
    ],
    image: "/avatars/aretha-franklin.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "david-bowie",
    name: "David Bowie",
    category: "singers",
    profession: "Singer, Songwriter & Actor",
    industry: "Art Rock, Glam Rock & Pop",
    country: "United Kingdom",
    birthDate: "1947-01-08",
    deathDate: "2016-01-10",
    birthPlace: "Brixton, London, England, UK",
    languages: ["English"],
    nickname: "Ziggy Stardust / Starman / The Thin White Duke",
    bio: "David Bowie was an English singer, songwriter, and actor acclaimed as one of the most influential musicians of the 20th century. Celebrated for his innovative chameleon-like reinventions, theatrical alter egos like Ziggy Stardust, and visual artistry, he revolutionized rock and pop. His landmark works include 'Space Oddity', 'Heroes', and his poignant final masterpiece 'Blackstar'.",
    famousWorks: [
      { year: 1969, title: "Space Oddity" },
      { year: 1972, title: "The Rise and Fall of Ziggy Stardust" },
      { year: 1977, title: "Heroes" },
      { year: 1983, title: "Let's Dance" },
      { year: 2016, title: "Blackstar" }
    ],
    awards: [
      "6 Grammy Awards & Grammy Lifetime Achievement Award (2006)",
      "Rock and Roll Hall of Fame Inductee (1996)",
      "Science Fiction and Fantasy Hall of Fame Inductee (2013)",
      "4 Brit Awards"
    ],
    faq: [
      { q: "Who was Ziggy Stardust?", a: "Ziggy Stardust was Bowie's flamboyant, bisexual alien rock star alter ego introduced in his iconic 1972 concept album." },
      { q: "What was Bowie's final album before his passing?", a: "'Blackstar', recorded in secret while battling terminal cancer, released on his 69th birthday two days before his death." },
      { q: "Why did David Bowie decline a knighthood?", a: "He declined both a CBE in 2000 and a Knighthood in 2003, stating that honors were not what he worked his whole life for." }
    ],
    related: ["freddie-mercury", "prince", "john-lennon"],
    sources: [
      "https://en.wikipedia.org/wiki/David_Bowie",
      "https://www.davidbowie.com"
    ],
    image: "/avatars/david-bowie.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "prince",
    name: "Prince",
    category: "singers",
    profession: "Singer-Songwriter, Multi-Instrumentalist & Producer",
    industry: "Funk, Rock & Pop (Minneapolis Sound)",
    country: "United States",
    birthDate: "1958-06-07",
    deathDate: "2016-04-21",
    birthPlace: "Minneapolis, Minnesota, USA",
    languages: ["English"],
    nickname: "The Purple One / His Royal Badness",
    bio: "Prince Rogers Nelson was an American singer, songwriter, musician, and multi-instrumentalist universally regarded as one of the greatest musical prodigies in history. Blending funk, R&B, rock, soul, and psychedelia, he pioneered the Minneapolis sound and frequently played every instrument on his studio albums. His 1984 film and soundtrack 'Purple Rain' stands among the greatest achievements in popular music.",
    famousWorks: [
      { year: 1982, title: "1999 (including 'Little Red Corvette')" },
      { year: 1984, title: "Purple Rain (including 'When Doves Cry')" },
      { year: 1987, title: "Sign o' the Times" },
      { year: 1991, title: "Diamonds and Pearls" },
      { year: 2007, title: "Super Bowl XLI Halftime Show" }
    ],
    awards: [
      "7 Grammy Awards",
      "Academy Award (Oscar) for Best Original Song Score ('Purple Rain', 1985)",
      "Rock and Roll Hall of Fame Inductee (2004 inaugural year of eligibility)",
      "Billboard Icon Award (2013)"
    ],
    faq: [
      { q: "Why did Prince change his name to an unpronounceable symbol?", a: "In 1993, in protest against his restrictive recording contract with Warner Bros., he changed his name to the 'Love Symbol'." },
      { q: "How many instruments could Prince play?", a: "He was proficient in over 27 instruments, often recording entire multi-track albums playing every drum, guitar, bass, and synthesizer part himself." },
      { q: "What is considered Prince's greatest live performance?", a: "His 2007 Super Bowl XLI halftime show, where he famously played 'Purple Rain' in a torrential downpour, is considered the greatest halftime show ever." }
    ],
    related: ["michael-jackson", "david-bowie", "stevie-wonder"],
    sources: [
      "https://en.wikipedia.org/wiki/Prince_(musician)",
      "https://www.prince.com"
    ],
    image: "/avatars/prince.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "billie-eilish",
    name: "Billie Eilish",
    category: "singers",
    profession: "Singer-Songwriter",
    industry: "Alt-Pop, Electropop & Indie",
    country: "United States",
    birthDate: "2001-12-18",
    birthPlace: "Los Angeles, California, USA",
    languages: ["English"],
    nickname: "Billie",
    bio: "Billie Eilish Pirate Baird O'Connell is an American singer-songwriter who revolutionized modern pop with her whisper-soft vocal intimacy and dark, minimalist production created alongside her brother Finneas. In 2020, she became the youngest artist in history to sweep all four main Grammy categories in a single year. She is also a two-time Academy Award winner for Best Original Song.",
    famousWorks: [
      { year: 2016, title: "Ocean Eyes" },
      { year: 2019, title: "When We All Fall Asleep, Where Do We Go? (including 'bad guy')" },
      { year: 2021, title: "No Time to Die (James Bond Theme)" },
      { year: 2021, title: "Happier Than Ever" },
      { year: 2023, title: "What Was I Made For? (from 'Barbie')" },
      { year: 2024, title: "Hit Me Hard and Soft" }
    ],
    awards: [
      "9 Grammy Awards (swept Big Four categories in 2020)",
      "2 Academy Awards (Oscars) for Best Original Song ('No Time to Die' & 'What Was I Made For?')",
      "2 Golden Globe Awards",
      "Youngest two-time Oscar winner in history at age 22"
    ],
    faq: [
      { q: "What historic Grammy record did Billie Eilish achieve in 2020?", a: "At age 18, she became the youngest artist ever to win all four General Field categories (Album, Record, Song of the Year, and Best New Artist) at once." },
      { q: "Who produces Billie Eilish's music?", a: "Her older brother Finneas O'Connell co-writes and produces virtually all her music in their childhood bedroom studio." },
      { q: "Which films won her Academy Awards?", a: "She won Oscars for the James Bond theme 'No Time to Die' (2022) and the Barbie movie song 'What Was I Made For?' (2024)." }
    ],
    related: ["taylor-swift", "lady-gaga", "adele"],
    sources: [
      "https://en.wikipedia.org/wiki/Billie_Eilish",
      "https://www.billieeilish.com"
    ],
    image: "/avatars/billie-eilish.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "shakira",
    name: "Shakira",
    category: "singers",
    profession: "Singer, Songwriter & Dancer",
    industry: "Latin Pop, Pop Rock & World Music",
    country: "Colombia",
    birthDate: "1977-02-02",
    birthPlace: "Barranquilla, Colombia",
    languages: ["Spanish", "English", "Portuguese", "Italian", "Arabic"],
    nickname: "Queen of Latin Music",
    bio: "Shakira Isabel Mebarak Ripoll is a Colombian singer, songwriter, and dancer recognized as the undisputed 'Queen of Latin Music'. Blending Middle Eastern belly dance, Latin rhythms, and rock sensibility, she achieved monumental crossover success with multi-platinum albums like 'Laundry Service' and 'Fijación Oral'. Her anthems 'Hips Don't Lie' and 'Waka Waka' became global cultural milestones.",
    famousWorks: [
      { year: 1998, title: "¿Dónde Están los Ladrones?" },
      { year: 2001, title: "Laundry Service (including 'Whenever, Wherever')" },
      { year: 2005, title: "Hips Don't Lie (feat. Wyclef Jean)" },
      { year: 2010, title: "Waka Waka (This Time for Africa, Official FIFA World Cup Song)" },
      { year: 2023, title: "Bzrp Music Sessions, Vol. 53" }
    ],
    awards: [
      "3 Grammy Awards & 15 Latin Grammy Awards",
      "Billboard Latin Woman of the Year (2023 inaugural)",
      "Hollywood Walk of Fame Star (First Colombian artist)",
      "7 Billboard Music Awards"
    ],
    faq: [
      { q: "What was the significance of Waka Waka?", a: "It was the official song of the 2010 FIFA World Cup in South Africa, becoming one of the most-viewed music videos and best-selling World Cup songs ever." },
      { q: "What is Shakira's philanthropic work?", a: "She founded the Pies Descalzos Foundation (Barefoot Foundation) in 1997 to provide quality education and nutrition to impoverished children in Colombia." },
      { q: "What makes Shakira's performance style unique?", a: "Her signature Middle Eastern belly dancing combined with explosive Latin rhythm and Lebanese vocal techniques." }
    ],
    related: ["beyonce", "rihanna", "celine-dion"],
    sources: [
      "https://en.wikipedia.org/wiki/Shakira",
      "https://www.shakira.com"
    ],
    image: "/avatars/shakira.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "mohammad-rafi",
    name: "Mohammad Rafi",
    category: "singers",
    profession: "Playback Singer",
    industry: "Indian Cinema (Bollywood)",
    country: "India",
    birthDate: "1924-12-24",
    deathDate: "1980-07-31",
    birthPlace: "Kotla Sultan Singh, Punjab, British India",
    languages: ["Hindi", "Urdu", "Punjabi"],
    nickname: "Rafi Sahab",
    bio: "Mohammad Rafi was one of the greatest and most versatile Indian playback singers of all time, acclaimed for his unmatched vocal range and emotional depth. Capable of singing classical ragas, soul-stirring ghazals, energetic rock-and-roll, and romantic ballads, he was the musical voice for generations of Bollywood icons including Dilip Kumar and Dev Anand. His legacy remains immortal across South Asia.",
    famousWorks: [
      { year: 1957, title: "Yeh Duniya Agar Mil Bhi Jaye (Pyaasa)" },
      { year: 1960, title: "Chaudhvin Ka Chand Ho (Chaudhvin Ka Chand)" },
      { year: 1965, title: "Tere Mere Sapne Ab Ek Rang Hain (Guide)" },
      { year: 1968, title: "Kya Hua Tera Wada (Hum Kisise Kum Naheen)" },
      { year: 1977, title: "Parda Hai Parda (Amar Akbar Anthony)" }
    ],
    awards: [
      "Padma Shri (Government of India, 1967)",
      "National Film Award for Best Male Playback Singer (1977)",
      "6 Filmfare Awards for Best Male Playback Singer",
      "Voted Greatest Voice of Hindi Cinema in CNN-IBN Poll"
    ],
    faq: [
      { q: "For which actors did Mohammad Rafi sing most famously?", a: "He provided unforgettable playback singing for legends Dilip Kumar, Dev Anand, Shammi Kapoor, Dharmendra, and Rajendra Kumar." },
      { q: "What was Mohammad Rafi's vocal specialty?", a: "He possessed extraordinary vocal range and the rare ability to mold his voice to match the exact personality and mannerisms of the on-screen actor." },
      { q: "How many songs did Mohammad Rafi record?", a: "He recorded over 7,000 songs across Hindi and numerous Indian regional languages throughout his illustrious career." }
    ],
    related: ["lata-mangeshkar", "kishore-kumar", "nusrat-fateh-ali-khan"],
    sources: [
      "https://en.wikipedia.org/wiki/Mohammed_Rafi",
      "https://www.britannica.com/biography/Mohammad-Rafi"
    ],
    image: "/avatars/mohammad-rafi.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "kishore-kumar",
    name: "Kishore Kumar",
    category: "singers",
    profession: "Playback Singer, Actor, Composer & Director",
    industry: "Indian Cinema (Bollywood)",
    country: "India",
    birthDate: "1929-08-04",
    deathDate: "1987-10-13",
    birthPlace: "Khandwa, Central Provinces (Madhya Pradesh, India)",
    languages: ["Hindi", "Bengali", "Marathi", "Urdu"],
    nickname: "Kishore Da",
    bio: "Kishore Kumar was an extraordinary Indian playback singer, actor, lyricist, and film director renowned for his unmatched versatility, comic genius, and soul-stirring baritone voice. Famous for introducing yodeling into Indian film music, he gave voice to Rajesh Khanna and Amitabh Bachchan during the golden eras of Bollywood. He holds the record for winning eight Filmfare Awards for Best Male Playback Singer.",
    famousWorks: [
      { year: 1969, title: "Roop Tera Mastana (Aradhana)" },
      { year: 1971, title: "Yeh Shaam Mastani (Kati Patang)" },
      { year: 1973, title: "Pal Pal Dil Ke Paas (Blackmail)" },
      { year: 1975, title: "O Saathi Re Tere Bina Bhi Kya Jeena (Muqaddar Ka Sikandar)" },
      { year: 1984, title: "Manzilein Apni Jagah Hain (Sharaabi)" }
    ],
    awards: [
      "Record 8 Filmfare Awards for Best Male Playback Singer",
      "Lata Mangeshkar Award (Government of Madhya Pradesh)",
      "Conferred posthumous national cultural honors across India"
    ],
    faq: [
      { q: "What unique vocal technique did Kishore Kumar introduce to Bollywood?", a: "He popularized western-style yodeling in Indian cinema, heard in iconic tracks like 'Chala Jata Hoon' and 'Zindagi Ek Safar Hai Suhana'." },
      { q: "Did Kishore Kumar have formal classical music training?", a: "Remarkably, he had no formal classical training; he was entirely self-taught, learning by listening to KL Saigal and western records." },
      { q: "How many Filmfare awards did Kishore Kumar win?", a: "He won a record eight Filmfare Awards for Best Male Playback Singer, the most in Bollywood history." }
    ],
    related: ["mohammad-rafi", "lata-mangeshkar", "atif-aslam"],
    sources: [
      "https://en.wikipedia.org/wiki/Kishore_Kumar",
      "https://www.britannica.com/biography/Kishore-Kumar"
    ],
    image: "/avatars/kishore-kumar.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "atif-aslam",
    name: "Atif Aslam",
    category: "singers",
    profession: "Playback Singer, Songwriter & Composer",
    industry: "Pop-Rock & Bollywood Playback",
    country: "Pakistan",
    birthDate: "1983-03-12",
    birthPlace: "Wazirabad, Punjab, Pakistan",
    languages: ["Urdu", "Punjabi", "Hindi", "English"],
    nickname: "Aadeez",
    bio: "Muhammad Atif Aslam is a Pakistani playback singer, songwriter, and actor celebrated for his powerful vocal belting technique and emotive romantic ballads. Breaking out with the rock band Jal and his debut album 'Jal Pari', he became one of the most beloved and celebrated playback singers across both Pakistan and India. His soulful hits like 'Aadat', 'Tajdar-e-Haram', and 'Tere Sang Yaara' have amassed billions of streams.",
    famousWorks: [
      { year: 2004, title: "Aadat (Jal Pari)" },
      { year: 2005, title: "Woh Lamhe (Zeher)" },
      { year: 2008, title: "Pehli Nazar Mein (Race)" },
      { year: 2013, title: "Jeena Jeena (Badlapur)" },
      { year: 2015, title: "Tajdar-e-Haram (Coke Studio Season 8)" },
      { year: 2017, title: "Dil Diyan Gallan (Tiger Zinda Hai)" }
    ],
    awards: [
      "Tamgha-e-Imtiaz (Medal of Excellence, Government of Pakistan, 2008)",
      "Hilal-e-Imtiaz (Crescent of Excellence, Government of Pakistan, 2024)",
      "Multiple Lux Style Awards for Best Male Singer",
      "Filmfare Award nominations for Best Male Playback"
    ],
    faq: [
      { q: "What was Atif Aslam's breakthrough song?", a: "'Aadat', recorded with the band Jal in 2003, which became a nationwide cultural phenomenon across Pakistan and South Asia." },
      { q: "What is Atif Aslam's most viewed Coke Studio performance?", a: "His soulful rendition of the Sabri Brothers' Qawwali 'Tajdar-e-Haram' on Coke Studio, exceeding 400 million views on YouTube." },
      { q: "What high civilian honors has Atif Aslam received from Pakistan?", a: "He received the Tamgha-e-Imtiaz in 2008 and Pakistan's second-highest civilian honor, the Hilal-e-Imtiaz, in 2024." }
    ],
    related: ["nusrat-fateh-ali-khan", "lata-mangeshkar", "mohammad-rafi"],
    sources: [
      "https://en.wikipedia.org/wiki/Atif_Aslam",
      "https://www.aadeez.com"
    ],
    image: "/avatars/atif-aslam.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "elton-john",
    name: "Elton John",
    category: "singers",
    profession: "Singer, Pianist & Composer",
    industry: "Pop, Glam Rock & Musical Theater",
    country: "United Kingdom",
    birthDate: "1947-03-25",
    birthPlace: "Pinner, Middlesex, England, UK",
    languages: ["English"],
    nickname: "Rocket Man",
    bio: "Sir Elton Hercules John is an English singer, pianist, and composer acclaimed as one of the most successful solo artists in music history, having sold more than 300 million records. In collaboration with lyricist Bernie Taupin, he composed enduring masterpieces including 'Your Song', 'Rocket Man', and 'Tiny Dancer'. His tribute 'Candle in the Wind 1997' is the best-selling chart single of all time.",
    famousWorks: [
      { year: 1970, title: "Your Song" },
      { year: 1972, title: "Rocket Man" },
      { year: 1973, title: "Goodbye Yellow Brick Road" },
      { year: 1994, title: "Can You Feel the Love Tonight (The Lion King)" },
      { year: 1997, title: "Candle in the Wind 1997 (Princess Diana Tribute)" }
    ],
    awards: [
      "EGOT Winner (Emmy, Grammy, Oscar, Tony winner)",
      "Knight Bachelor conferred by Queen Elizabeth II (1998)",
      "5 Grammy Awards & 2 Academy Awards (Oscars)",
      "Rock and Roll Hall of Fame Inductee (1994)"
    ],
    faq: [
      { q: "What is the best-selling physical single in music history?", a: "'Candle in the Wind 1997', rewritten and performed by Elton John at Princess Diana's funeral, sold over 33 million copies." },
      { q: "Who is Elton John's longtime songwriting partner?", a: "Bernie Taupin; their legendary partnership began in 1967 and has produced over 30 albums." },
      { q: "Is Elton John an EGOT winner?", a: "Yes, he completed the prestigious EGOT grand slam in 2024 by winning an Emmy for his farewell concert special." }
    ],
    related: ["freddie-mercury", "paul-mccartney", "david-bowie"],
    sources: [
      "https://en.wikipedia.org/wiki/Elton_John",
      "https://www.eltonjohn.com"
    ],
    image: "/avatars/elton-john.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "stevie-wonder",
    name: "Stevie Wonder",
    category: "singers",
    profession: "Singer-Songwriter, Multi-Instrumentalist & Record Producer",
    industry: "R&B, Soul, Funk & Motown",
    country: "United States",
    birthDate: "1950-05-13",
    birthPlace: "Saginaw, Michigan, USA",
    languages: ["English"],
    nickname: "Stevie",
    bio: "Stevie Wonder (born Stevland Hardaway Judkins) is an American singer-songwriter, musician, and record producer recognized as a pioneering genius who transformed R&B and soul. Blind shortly after birth, he signed with Motown at age eleven as a child prodigy and mastered piano, synthesizer, harmonica, and drums. In his 1970s 'classic period', he created monumental albums including 'Innervisions' and 'Songs in the Key of Life'.",
    famousWorks: [
      { year: 1972, title: "Superstition (Talking Book)" },
      { year: 1973, title: "Innervisions (including 'Living for the City')" },
      { year: 1976, title: "Songs in the Key of Life (including 'Sir Duke' & 'Isn't She Lovely')" },
      { year: 1982, title: "Ebony and Ivory (with Paul McCartney)" },
      { year: 1984, title: "I Just Called to Say I Love You" }
    ],
    awards: [
      "25 Grammy Awards (most won by any male solo artist)",
      "Academy Award (Oscar) for Best Original Song ('I Just Called to Say I Love You', 1985)",
      "Presidential Medal of Freedom (2014)",
      "Rock and Roll Hall of Fame Inductee (1989)"
    ],
    faq: [
      { q: "How many Grammy Awards has Stevie Wonder won?", a: "He has won 25 Grammy Awards, making him the most-awarded male solo artist in Grammy history." },
      { q: "What was Stevie Wonder's role in making Martin Luther King Jr. Day a holiday?", a: "He led an intensive national campaign, releasing the anthem 'Happy Birthday' in 1980, which spearheaded the passage of the federal holiday." },
      { q: "Which instruments does Stevie Wonder play?", a: "He is a master of the piano, synthesizer, clavinet, harmonica, drums, and congas." }
    ],
    related: ["michael-jackson", "aretha-franklin", "prince"],
    sources: [
      "https://en.wikipedia.org/wiki/Stevie_Wonder",
      "https://www.britannica.com/biography/Stevie-Wonder"
    ],
    image: "/avatars/stevie-wonder.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "lady-gaga",
    name: "Lady Gaga",
    category: "singers",
    profession: "Singer, Songwriter & Actress",
    industry: "Pop, Dance-Pop & Film",
    country: "United States",
    birthDate: "1986-03-28",
    birthPlace: "New York City, New York, USA",
    languages: ["English", "Italian"],
    nickname: "Mother Monster",
    bio: "Stefani Joanne Angelina Germanotta, known professionally as Lady Gaga, is an American singer, songwriter, and actress known for her image reinventions and versatile musical versatility. Rising to prominence with synth-pop anthems 'Just Dance' and 'Bad Romance', she proved her vocal virtuosity with jazz standards alongside Tony Bennett and dramatic acting in 'A Star Is Born'.",
    famousWorks: [
      { year: 2008, title: "The Fame (including 'Poker Face')" },
      { year: 2009, title: "The Fame Monster (including 'Bad Romance')" },
      { year: 2011, title: "Born This Way" },
      { year: 2018, title: "A Star Is Born Soundtrack (including 'Shallow')" },
      { year: 2020, title: "Chromatica (including 'Rain on Me')" }
    ],
    awards: [
      "13 Grammy Awards",
      "Academy Award (Oscar) for Best Original Song ('Shallow', 2019)",
      "2 Golden Globe Awards & BAFTA Award",
      "Billboard Woman of the Year (2015)"
    ],
    faq: [
      { q: "What is Lady Gaga's real name?", a: "Stefani Joanne Angelina Germanotta, born and raised in Manhattan, New York City." },
      { q: "Which song won Lady Gaga an Academy Award?", a: "'Shallow', the emotional duet from the 2018 movie 'A Star Is Born', won the Oscar for Best Original Song." },
      { q: "What is the name of Lady Gaga's fan base?", a: "Her passionate global fan base is affectionately known as 'Little Monsters'." }
    ],
    related: ["taylor-swift", "madonna", "billie-eilish"],
    sources: [
      "https://en.wikipedia.org/wiki/Lady_Gaga",
      "https://www.ladygaga.com"
    ],
    image: "/avatars/lady-gaga.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  },
  {
    slug: "bruce-springsteen",
    name: "Bruce Springsteen",
    category: "singers",
    profession: "Singer-Songwriter & Guitarist",
    industry: "Heartland Rock & Folk Rock",
    country: "United States",
    birthDate: "1949-09-23",
    birthPlace: "Long Branch, New Jersey, USA",
    languages: ["English"],
    nickname: "The Boss",
    bio: "Bruce Frederick Joseph Springsteen is an American singer, songwriter, and musician who pioneered heartland rock, combining poetic lyrics about working-class American life with energetic rock arrangements. Backed by the legendary E Street Band, his epic four-hour marathon concerts and landmark albums like 'Born to Run' and 'Born in the U.S.A.' made him an enduring voice of American culture.",
    famousWorks: [
      { year: 1975, title: "Born to Run" },
      { year: 1978, title: "Darkness on the Edge of Town" },
      { year: 1982, title: "Nebraska" },
      { year: 1984, title: "Born in the U.S.A." },
      { year: 1993, title: "Streets of Philadelphia (from 'Philadelphia')" }
    ],
    awards: [
      "20 Grammy Awards",
      "Academy Award (Oscar) for Best Original Song ('Streets of Philadelphia', 1994)",
      "Presidential Medal of Freedom (2016)",
      "Rock and Roll Hall of Fame Inductee (1999)"
    ],
    faq: [
      { q: "Why is Bruce Springsteen called 'The Boss'?", a: "In his early band days with the Earth Band and E Street Band, he took on the responsibility of collecting the band's pay from club owners and distributing it." },
      { q: "What was Bruce Springsteen's biggest selling album?", a: "'Born in the U.S.A.' (1984), which yielded seven top-10 singles and sold more than 30 million copies worldwide." },
      { q: "Did Bruce Springsteen win an Oscar?", a: "Yes, he won the 1994 Academy Award for Best Original Song for 'Streets of Philadelphia' from the film Philadelphia." }
    ],
    related: ["bob-marley", "john-lennon", "paul-mccartney"],
    sources: [
      "https://en.wikipedia.org/wiki/Bruce_Springsteen",
      "https://www.brucespringsteen.net"
    ],
    image: "/avatars/bruce-springsteen.jpg",
    imageCredit: "Wikimedia Commons (CC BY-SA / Public Domain)"
  }
];

const dest = path.join(__dirname, '..', 'data', 'profiles', 'singers.json');
fs.writeFileSync(dest, JSON.stringify(singers, null, 2), 'utf8');
console.log(`Successfully wrote ${singers.length} profiles to ${dest}`);

