const fs = require('fs');
const path = require('path');

const existing = JSON.parse(fs.readFileSync('data/profiles/scientists.json', 'utf8'));

const newScientists = [
  {
    slug: "isaac-newton",
    name: "Sir Isaac Newton",
    category: "scientists",
    profession: "Physicist, Mathematician & Astronomer",
    industry: "Classical Mechanics & Calculus",
    country: "England",
    birthDate: "1643-01-04",
    deathDate: "1727-03-31",
    birthPlace: "Woolsthorpe-by-Colsterworth, Lincolnshire, England",
    languages: ["English", "Latin", "Ancient Greek"],
    nickname: "Father of Classical Mechanics",
    bio: "Sir Isaac Newton was an English polymath active as a mathematician, physicist, astronomer, alchemist, and author. Widely recognized as one of the greatest mathematicians and physicists of all time and among the most influential scientists in history, Newton formulated the laws of motion and universal gravitation. His 1687 book Philosophiæ Naturalis Principia Mathematica laid the foundations for classical mechanics, while his development of infinitesimal calculus revolutionized mathematics.",
    famousWorks: [
      { year: 1687, title: "Philosophiæ Naturalis Principia Mathematica (Laws of Motion & Universal Gravitation)" },
      { year: 1704, title: "Opticks (Refraction, Dispersion, and the Particle Theory of Light)" },
      { year: 1671, title: "Method of Fluxions (Mathematical Foundations of Calculus)" }
    ],
    awards: [
      "Knight Bachelor conferred by Queen Anne (1705)",
      "President of the Royal Society (1703–1727)",
      "Lucasian Professor of Mathematics at Cambridge (1669–1702)",
      "Master of the Royal Mint (1699–1727)"
    ],
    faq: [
      {
        q: "Did an apple really fall on Isaac Newton's head?",
        a: "While an apple did not necessarily strike his head, Newton observed an apple falling straight to the ground at Woolsthorpe Manor, which prompted him to realize that the same gravitational force pulling the apple also keeps the Moon in orbit around the Earth."
      },
      {
        q: "What are Newton's Three Laws of Motion?",
        a: "1) Law of Inertia: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a net external force. 2) F = ma: Force equals mass times acceleration. 3) Action-Reaction: For every action, there is an equal and opposite reaction."
      }
    ],
    related: ["galileo-galilei", "albert-einstein", "johannes-kepler"],
    sources: [
      "https://en.wikipedia.org/wiki/Isaac_Newton",
      "https://royalsociety.org/collections/isaac-newton/"
    ],
    image: "/avatars/isaac-newton.jpg",
    imageCredit: "Wikimedia Commons / Godfrey Kneller (1689)"
  },
  {
    slug: "nikola-tesla",
    name: "Nikola Tesla",
    category: "scientists",
    profession: "Electrical & Mechanical Engineer, Physicist",
    industry: "Electromagnetism & AC Power",
    country: "United States",
    birthDate: "1856-07-10",
    deathDate: "1943-01-07",
    birthPlace: "Smiljan, Austrian Empire (modern-day Croatia)",
    languages: ["Serbo-Croatian", "English", "German", "French", "Italian", "Czech", "Latin", "Hungarian"],
    nickname: "The Master of Lightning",
    bio: "Nikola Tesla was a Serbian-American inventor, electrical engineer, mechanical engineer, and futurist best known for his contributions to the design of the modern alternating current (AC) electricity supply system. Working in the United States, Tesla patented the polyphase AC induction motor and transformers, licensed by George Westinghouse. His pioneering experiments with high-voltage and radio-frequency electricity led to the Tesla coil, wireless communications breakthroughs, and early radar concepts.",
    famousWorks: [
      { year: 1887, title: "Invention of the AC Induction Motor and Polyphase Power Transmission System" },
      { year: 1891, title: "Invention of the resonant transformer circuit (Tesla Coil)" },
      { year: 1898, title: "Demonstration of the Teleautomaton (First radio-controlled boat)" },
      { year: 1895, title: "Design of the world's first major hydroelectric power plant at Niagara Falls" }
    ],
    awards: [
      "IEEE Edison Medal (1916)",
      "Elliott Cresson Medal (1894)",
      "John Scott Medal (1934)",
      "Order of St. Sava (1892)"
    ],
    faq: [
      {
        q: "What was the 'War of the Currents' between Tesla and Edison?",
        a: "It was a commercial rivalry in the late 1880s where Thomas Edison promoted direct current (DC) while Nikola Tesla and George Westinghouse proved alternating current (AC) was far superior for transmitting electricity over long distances safely and economically."
      },
      {
        q: "What is the Tesla coil used for?",
        a: "Invented in 1891, the Tesla coil produces high-voltage, low-current, high-frequency alternating-current electricity, and served as the cornerstone for wireless telegraphy, spark-gap radio transmitters, and early medical electrotherapy."
      }
    ],
    related: ["thomas-edison", "michael-faraday", "albert-einstein"],
    sources: [
      "https://en.wikipedia.org/wiki/Nikola_Tesla",
      "https://www.ieee.org/about/awards/bios/edison-recipients.html"
    ],
    image: "/avatars/nikola-tesla.jpg",
    imageCredit: "Wikimedia Commons / Napoleon Sarony (1893)"
  },
  {
    slug: "stephen-hawking",
    name: "Stephen Hawking",
    category: "scientists",
    profession: "Theoretical Physicist & Cosmologist",
    industry: "Astrophysics & Quantum Cosmology",
    country: "United Kingdom",
    birthDate: "1942-01-08",
    deathDate: "2018-03-14",
    birthPlace: "Oxford, England",
    languages: ["English"],
    nickname: "Master of the Universe",
    bio: "Stephen William Hawking was an English theoretical physicist, cosmologist, and author who was director of research at the Centre for Theoretical Cosmology at the University of Cambridge. Hawking made groundbreaking contributions to general relativity and quantum mechanics, most notably proving gravitational singularity theorems in collaboration with Roger Penrose and predicting that black holes emit radiation, now known as Hawking radiation. Diagnosed with motor neuron disease (ALS) at age 21, he achieved global fame through his best-selling science book A Brief History of Time.",
    famousWorks: [
      { year: 1970, title: "Penrose–Hawking Singularity Theorems (Proving the Big Bang began from a singularity)" },
      { year: 1974, title: "Theoretical prediction of Hawking Radiation emitted by black holes" },
      { year: 1988, title: "A Brief History of Time: From the Big Bang to Black Holes" },
      { year: 1983, title: "Hartle–Hawking No-Boundary Proposal for the Wave Function of the Universe" }
    ],
    awards: [
      "Albert Einstein Award (1978)",
      "Commander of the Order of the British Empire (CBE, 1982)",
      "Wolf Prize in Physics (1988)",
      "Copley Medal of the Royal Society (2006)",
      "Presidential Medal of Freedom (2009)"
    ],
    faq: [
      {
        q: "What is Hawking radiation?",
        a: "It is black-body radiation predicted to be released by black holes due to quantum effects near the event horizon. This implies that black holes can gradually lose mass and eventually evaporate completely."
      },
      {
        q: "What was Stephen Hawking's position at Cambridge?",
        a: "Hawking served as the Lucasian Professor of Mathematics at the University of Cambridge from 1979 to 2009, the same prestigious chair once held by Sir Isaac Newton."
      }
    ],
    related: ["albert-einstein", "isaac-newton", "carl-sagan"],
    sources: [
      "https://en.wikipedia.org/wiki/Stephen_Hawking",
      "https://www.hawking.org.uk/"
    ],
    image: "/avatars/stephen-hawking.jpg",
    imageCredit: "Wikimedia Commons / NASA StarChild (Stephen Hawking)"
  },
  {
    slug: "charles-darwin",
    name: "Charles Darwin",
    category: "scientists",
    profession: "Naturalist, Biologist & Geologist",
    industry: "Evolutionary Biology",
    country: "United Kingdom",
    birthDate: "1809-02-12",
    deathDate: "1882-04-19",
    birthPlace: "Shrewsbury, Shropshire, England",
    languages: ["English"],
    nickname: "Father of Evolution",
    bio: "Charles Robert Darwin was an English naturalist, geologist, and biologist widely recognized for his scientific contributions to the understanding of life on Earth. His proposition that all species of life have descended over time from common ancestors is now widely accepted and considered a foundational concept in modern science. In a joint publication with Alfred Russel Wallace, he introduced his scientific theory that this branching pattern of evolution resulted from a process he named natural selection, fully detailed in his 1859 masterwork On the Origin of Species.",
    famousWorks: [
      { year: 1839, title: "The Voyage of the Beagle (Geological and biological journal of South America & Galápagos)" },
      { year: 1859, title: "On the Origin of Species by Means of Natural Selection" },
      { year: 1871, title: "The Descent of Man, and Selection in Relation to Sex" },
      { year: 1872, title: "The Expression of the Emotions in Man and Animals" }
    ],
    awards: [
      "Royal Medal of the Royal Society (1853)",
      "Wollaston Medal of the Geological Society (1859)",
      "Copley Medal of the Royal Society (1864)",
      "Pour le Mérite for Sciences and Arts (1867)"
    ],
    faq: [
      {
        q: "What is natural selection?",
        a: "Natural selection is the differential survival and reproduction of individuals due to differences in phenotype. Organisms with traits better suited to their environment are more likely to survive and pass those heritable traits to the next generation."
      },
      {
        q: "What did Darwin discover in the Galápagos Islands?",
        a: "He observed distinct variations among finch species and giant tortoises on different islands, where beak sizes and shell shapes had adapted to the specific food sources available on each island."
      }
    ],
    related: ["gregor-mendel", "louis-pasteur", "alexander-fleming"],
    sources: [
      "https://en.wikipedia.org/wiki/Charles_Darwin",
      "https://www.darwinproject.ac.uk/"
    ],
    image: "/avatars/charles-darwin.jpg",
    imageCredit: "Wikimedia Commons / John Collier (1883)"
  },
  {
    slug: "galileo-galilei",
    name: "Galileo Galilei",
    category: "scientists",
    profession: "Astronomer, Physicist & Engineer",
    industry: "Observational Astronomy & Kinematics",
    country: "Italy",
    birthDate: "1564-02-15",
    deathDate: "1642-01-08",
    birthPlace: "Pisa, Duchy of Florence",
    languages: ["Italian", "Latin"],
    nickname: "Father of Modern Science",
    bio: "Galileo Galilei was an Italian polymath active as an astronomer, physicist, and engineer. Often referred to as the father of observational astronomy, modern physics, the scientific method, and modern science, Galileo made profound improvements to the refracting telescope. His telescopic observations confirmed the phases of Venus, revealed four large moons of Jupiter (the Galilean moons), analyzed sunspots, and provided empirical evidence championing Copernican heliocentrism.",
    famousWorks: [
      { year: 1610, title: "Sidereus Nuncius (The Starry Messenger announcing the discovery of Jupiter's moons)" },
      { year: 1632, title: "Dialogue Concerning the Two Chief World Systems (Comparing Copernican and Ptolemaic models)" },
      { year: 1638, title: "Discourses and Mathematical Demonstrations Relating to Two New Sciences (Kinematics & Strength of Materials)" }
    ],
    awards: [
      "Chief Mathematician and Philosopher to the Grand Duke of Tuscany (1610)",
      "Member of the Accademia dei Lincei (1611)"
    ],
    faq: [
      {
        q: "What are the Galilean moons of Jupiter?",
        a: "They are the four largest moons of Jupiter discovered by Galileo in January 1610: Io, Europa, Ganymede, and Callisto. They were the first celestial bodies observed orbiting another planet."
      },
      {
        q: "Why was Galileo put on trial by the Roman Inquisition?",
        a: "In 1633, he was tried for heresy for advocating the Copernican theory that the Earth revolves around the Sun, which contradicted contemporary theological interpretations of scripture. He was sentenced to house arrest for the rest of his life."
      }
    ],
    related: ["isaac-newton", "johannes-kepler", "albert-einstein"],
    sources: [
      "https://en.wikipedia.org/wiki/Galileo_Galilei",
      "https://plato.stanford.edu/entries/galileo/"
    ],
    image: "/avatars/galileo-galilei.jpg",
    imageCredit: "Wikimedia Commons / Justus Sustermans (1636)"
  },
  {
    slug: "michael-faraday",
    name: "Michael Faraday",
    category: "scientists",
    profession: "Physicist & Chemist",
    industry: "Electromagnetism & Electrochemistry",
    country: "United Kingdom",
    birthDate: "1791-09-22",
    deathDate: "1867-08-25",
    birthPlace: "Newington Butts, Surrey, England",
    languages: ["English"],
    nickname: "Father of Electrical Engineering",
    bio: "Michael Faraday was an English scientist who made foundational contributions to the study of electromagnetism and electrochemistry. His discoveries include the principles underlying electromagnetic induction, diamagnetism, and the laws of electrolysis. Despite having received little formal education, Faraday was one of the most influential experimental scientists in history; Albert Einstein kept pictures of Faraday, Isaac Newton, and James Clerk Maxwell on his study wall.",
    famousWorks: [
      { year: 1821, title: "Invention of the Homopolar Motor (Demonstration of electromagnetic rotation)" },
      { year: 1831, title: "Discovery of Electromagnetic Induction (Faraday's Law)" },
      { year: 1834, title: "Formulation of the Laws of Electrolysis (Electrochemical equivalents)" },
      { year: 1845, title: "Discovery of the Faraday Effect (Magneto-optical rotation) and Diamagnetism" }
    ],
    awards: [
      "Copley Medal of the Royal Society (1832, 1838)",
      "Royal Medal (1835, 1846)",
      "Rumford Medal (1846)",
      "Albert Medal of the Royal Society of Arts (1866)"
    ],
    faq: [
      {
        q: "What is Faraday's Law of Electromagnetic Induction?",
        a: "It states that any change in the magnetic environment of a coil of wire will cause a voltage (electromotive force) to be induced in the coil. This fundamental principle powers every electric generator, transformer, and alternator today."
      },
      {
        q: "What is a Faraday cage?",
        a: "An enclosure formed by conductive material or wire mesh that shields its interior from external static and non-static electric fields, preventing electromagnetic interference."
      }
    ],
    related: ["james-clerk-maxwell", "nikola-tesla", "isaac-newton"],
    sources: [
      "https://en.wikipedia.org/wiki/Michael_Faraday",
      "https://royalsociety.org/collections/michael-faraday/"
    ],
    image: "/avatars/michael-faraday.jpg",
    imageCredit: "Wikimedia Commons / Thomas Phillips (1842)"
  },
  {
    slug: "louis-pasteur",
    name: "Louis Pasteur",
    category: "scientists",
    profession: "Microbiologist & Chemist",
    industry: "Germ Theory & Immunology",
    country: "France",
    birthDate: "1822-12-27",
    deathDate: "1895-09-28",
    birthPlace: "Dole, Jura, France",
    languages: ["French"],
    nickname: "Father of Microbiology",
    bio: "Louis Pasteur was a French chemist and microbiologist renowned for his discoveries of the principles of vaccination, microbial fermentation, and pasteurization. His research in chemistry resolved the asymmetry of crystals and founded stereochemistry, but his most celebrated achievements were proving the germ theory of disease and disproving spontaneous generation. He developed the first laboratory vaccines for rabies and anthrax, saving millions of lives worldwide.",
    famousWorks: [
      { year: 1848, title: "Discovery of Molecular Chirality (Optical Isomerism in Tartaric Acid)" },
      { year: 1864, title: "Development of the Pasteurization process to preserve beverages" },
      { year: 1881, title: "Demonstration of the Anthrax Vaccine at Pouilly-le-Fort" },
      { year: 1885, title: "Successful human administration of the Rabies Vaccine to Joseph Meister" }
    ],
    awards: [
      "Rumford Medal of the Royal Society (1856)",
      "Copley Medal (1874)",
      "Leeuwenhoek Medal (1895)",
      "Grand Cross of the Legion of Honour (1881)"
    ],
    faq: [
      {
        q: "What is pasteurization?",
        a: "It is a heat-treatment process developed by Pasteur in 1864 in which liquids like milk, wine, and beer are heated to a specific temperature for a set time to destroy pathogens without altering their chemical composition."
      },
      {
        q: "How did Pasteur disprove spontaneous generation?",
        a: "Using swan-neck flasks, he demonstrated that sterile broth remains clear indefinitely unless airborne dust and microorganisms are allowed to enter the broth, proving that living microbes arise only from other living microbes."
      }
    ],
    related: ["edward-jenner", "alexander-fleming", "charles-darwin"],
    sources: [
      "https://en.wikipedia.org/wiki/Louis_Pasteur",
      "https://www.pasteur.fr/en/institut-pasteur/history"
    ],
    image: "/avatars/louis-pasteur.jpg",
    imageCredit: "Wikimedia Commons / Albert Edelfelt (1885)"
  },
  {
    slug: "richard-feynman",
    name: "Richard Feynman",
    category: "scientists",
    profession: "Theoretical Physicist",
    industry: "Quantum Electrodynamics & Particle Physics",
    country: "United States",
    birthDate: "1918-05-11",
    deathDate: "1988-02-15",
    birthPlace: "Queens, New York City, USA",
    languages: ["English", "Portuguese"],
    nickname: "The Great Explainer",
    bio: "Richard Phillips Feynman was an American theoretical physicist widely regarded as one of the most brilliant and charismatic scientists of the twentieth century. He is celebrated for his work in the path integral formulation of quantum mechanics, the theory of quantum electrodynamics (QED), and the physics of the superfluidity of supercooled liquid helium. He introduced Feynman diagrams, pictorial representations of mathematical expressions governing subatomic particle behavior, and helped pioneer quantum computing and nanotechnology.",
    famousWorks: [
      { year: 1948, title: "Path Integral Formulation of Quantum Mechanics" },
      { year: 1949, title: "Feynman Diagrams for Quantum Electrodynamics (QED)" },
      { year: 1959, title: "There's Plenty of Room at the Bottom (Foundational vision for nanotechnology)" },
      { year: 1964, title: "The Feynman Lectures on Physics" },
      { year: 1986, title: "Rogers Commission Report uncovering the Challenger disaster O-ring failure" }
    ],
    awards: [
      "Nobel Prize in Physics (1965)",
      "Albert Einstein Award (1954)",
      "Ernest Orlando Lawrence Award (1962)",
      "Oersted Medal (1972)",
      "National Medal of Science (1979)"
    ],
    faq: [
      {
        q: "Why did Richard Feynman win the Nobel Prize in Physics?",
        a: "He shared the 1965 Nobel Prize with Julian Schwinger and Shin'ichirō Tomonaga for their fundamental work in quantum electrodynamics, with deep-ploughing consequences for the physics of elementary particles."
      },
      {
        q: "What role did Feynman play in the Space Shuttle Challenger investigation?",
        a: "In 1986, during televised hearings, Feynman famously demonstrated that the shuttle's rubber O-ring seals lost resilience when submerged in ice water, identifying the exact cause of the shuttle's catastrophic failure in cold weather."
      }
    ],
    related: ["albert-einstein", "j-robert-oppenheimer", "niels-bohr"],
    sources: [
      "https://en.wikipedia.org/wiki/Richard_Feynman",
      "https://www.nobelprize.org/prizes/physics/1965/feynman/biographical/"
    ],
    image: "/avatars/richard-feynman.jpg",
    imageCredit: "Wikimedia Commons / Los Alamos National Laboratory (1984)"
  },
  {
    slug: "niels-bohr",
    name: "Niels Bohr",
    category: "scientists",
    profession: "Theoretical Physicist",
    industry: "Atomic Structure & Quantum Mechanics",
    country: "Denmark",
    birthDate: "1885-10-07",
    deathDate: "1962-11-18",
    birthPlace: "Copenhagen, Denmark",
    languages: ["Danish", "English", "German"],
    nickname: "Father of the Quantum Atom",
    bio: "Niels Henrik David Bohr was a Danish physicist who made foundational contributions to understanding atomic structure and quantum theory, for which he received the Nobel Prize in Physics in 1922. Bohr developed the Bohr model of the atom, in which he proposed that energy levels of electrons are discrete and that electrons revolve in stable orbits around the atomic nucleus. He also conceived the principle of complementarity, stating that items could be separately analyzed as having several contradictory properties, like being both a wave and a stream of particles.",
    famousWorks: [
      { year: 1913, title: "The Bohr Model of the Hydrogen Atom (Discrete quantized electron orbits)" },
      { year: 1927, title: "Principle of Complementarity (Copenhagen Interpretation of Quantum Mechanics)" },
      { year: 1936, title: "Liquid Drop Model of the Atomic Nucleus" },
      { year: 1939, title: "Mechanism of Nuclear Fission (with John Archibald Wheeler)" }
    ],
    awards: [
      "Nobel Prize in Physics (1922)",
      "Hughes Medal of the Royal Society (1921)",
      "Matteucci Medal (1923)",
      "Franklin Medal (1926)",
      "Copley Medal (1938)",
      "Order of the Elephant (1947)"
    ],
    faq: [
      {
        q: "What was the Bohr–Einstein debate about?",
        a: "It was a famous series of public and private philosophical disputes between Niels Bohr and Albert Einstein regarding the interpretation and completeness of quantum mechanics, centering on Heisenberg's uncertainty principle and quantum indeterminism."
      },
      {
        q: "What was the Copenhagen Institute?",
        a: "Founded by Bohr in 1921 (now the Niels Bohr Institute), it served as the global epicenter for the development of quantum physics, hosting luminaries like Werner Heisenberg, Wolfgang Pauli, and Paul Dirac."
      }
    ],
    related: ["albert-einstein", "werner-heisenberg", "max-planck"],
    sources: [
      "https://en.wikipedia.org/wiki/Niels_Bohr",
      "https://www.nobelprize.org/prizes/physics/1922/bohr/biographical/"
    ],
    image: "/avatars/niels-bohr.jpg",
    imageCredit: "Wikimedia Commons / Bain News Service (1922)"
  },
  {
    slug: "james-clerk-maxwell",
    name: "James Clerk Maxwell",
    category: "scientists",
    profession: "Theoretical Physicist & Mathematician",
    industry: "Classical Electromagnetism",
    country: "Scotland, United Kingdom",
    birthDate: "1831-06-13",
    deathDate: "1879-11-05",
    birthPlace: "Edinburgh, Scotland",
    languages: ["English", "Latin"],
    nickname: "Architect of Modern Physics",
    bio: "James Clerk Maxwell was a Scottish mathematician and scientist responsible for the classical theory of electromagnetic radiation, which brought together for the first time electricity, magnetism, and light as different manifestations of the same phenomenon. Maxwell's equations for electromagnetism have been called the 'second great unification in physics' after the first realized by Isaac Newton. He also created the first durable color photograph in 1861 and laid the foundation for the kinetic theory of gases.",
    famousWorks: [
      { year: 1865, title: "A Dynamical Theory of the Electromagnetic Field (Maxwell's Equations)" },
      { year: 1860, title: "Illustrations of the Dynamical Theory of Gases (Maxwell Distribution of Molecular Speeds)" },
      { year: 1861, title: "First Demonstration of Durable Three-Color Photography (Tartan Ribbon)" },
      { year: 1859, title: "Mathematical proof of the nature of Saturn's Rings (Composed of small particles)" }
    ],
    awards: [
      "Rumford Medal of the Royal Society (1860)",
      "Adams Prize of Cambridge University (1857)",
      "Keith Medal of the Royal Society of Edinburgh (1869)"
    ],
    faq: [
      {
        q: "What are Maxwell's Equations?",
        a: "They are a set of four coupled partial differential equations (Gauss's law, Gauss's law for magnetism, Faraday's law of induction, and the Ampère–Maxwell law) that form the mathematical basis for classical electromagnetism, optics, and electric circuits."
      },
      {
        q: "What did Maxwell predict about light?",
        a: "He calculated the speed of electromagnetic waves from purely electric and magnetic constants and found it matched the measured speed of light, concluding that light itself is an electromagnetic wave."
      }
    ],
    related: ["michael-faraday", "isaac-newton", "albert-einstein"],
    sources: [
      "https://en.wikipedia.org/wiki/James_Clerk_Maxwell",
      "https://royalsociety.org/collections/james-clerk-maxwell/"
    ],
    image: "/avatars/james-clerk-maxwell.jpg",
    imageCredit: "Wikimedia Commons / Fergus of Greenock (1870)"
  },
  {
    slug: "carl-sagan",
    name: "Carl Sagan",
    category: "scientists",
    profession: "Astronomer, Planetary Scientist & Science Communicator",
    industry: "Planetary Science & Astrobiology",
    country: "United States",
    birthDate: "1934-11-09",
    deathDate: "1996-12-20",
    birthPlace: "Brooklyn, New York City, USA",
    languages: ["English"],
    nickname: "The People's Astronomer",
    bio: "Carl Edward Sagan was an American astronomer, planetary scientist, cosmologist, and author. He assembled the first physical messages sent into space: the Pioneer plaque and the Voyager Golden Record, universal messages that could potentially be understood by any extraterrestrial intelligence that might find them. Sagan is world-renowned for his research on the greenhouse effect on Venus, the seasonal changes on Mars, and for writing and narrating the landmark 1980 television series Cosmos: A Personal Voyage, which became one of the most widely watched public television programs in history.",
    famousWorks: [
      { year: 1980, title: "Cosmos: A Personal Voyage (13-part television series & accompanying book)" },
      { year: 1994, title: "Pale Blue Dot: A Vision of the Human Future in Space" },
      { year: 1977, title: "Conception and curation of the Voyager Golden Record" },
      { year: 1985, title: "Contact (Science fiction novel exploring humanity's first contact with extraterrestrial intelligence)" }
    ],
    awards: [
      "Pulitzer Prize for General Nonfiction for 'The Dragons of Eden' (1978)",
      "NASA Distinguished Public Service Medal (1977, 1981)",
      "Public Welfare Medal of the National Academy of Sciences (1994)",
      "Hugo Award for Cosmos (1981)"
    ],
    faq: [
      {
        q: "What is the famous 'Pale Blue Dot'?",
        a: "It is a photograph of Earth taken on February 14, 1990, by the Voyager 1 space probe from a record distance of 6 billion kilometers. At Sagan's suggestion, NASA turned Voyager around to take one last look at Earth, showing our planet as a tiny speck of light in the vastness of space."
      },
      {
        q: "What were Sagan's scientific contributions to Venus and Titan?",
        a: "He correctly predicted that Venus suffers from a runaway greenhouse effect making its surface hot enough to melt lead, and that Saturn's moon Titan possesses complex organic molecules and oceans of liquid hydrocarbons."
      }
    ],
    related: ["stephen-hawking", "richard-feynman", "albert-einstein"],
    sources: [
      "https://en.wikipedia.org/wiki/Carl_Sagan",
      "https://www.loc.gov/item/prn-13-189/"
    ],
    image: "/avatars/carl-sagan.jpg",
    imageCredit: "Wikimedia Commons / NASA JPL (Carl Sagan)"
  },
  {
    slug: "alan-turing",
    name: "Alan Turing",
    category: "scientists",
    profession: "Mathematician, Computer Scientist & Cryptanalyst",
    industry: "Theoretical Computer Science & Artificial Intelligence",
    country: "United Kingdom",
    birthDate: "1912-06-23",
    deathDate: "1954-06-07",
    birthPlace: "Maida Vale, London, England",
    languages: ["English", "French", "German"],
    nickname: "Father of Modern Computer Science",
    bio: "Alan Mathison Turing was an English mathematician, computer scientist, logician, cryptanalyst, and theoretical biologist. Turing was highly influential in the development of theoretical computer science, providing a formalisation of the concepts of algorithm and computation with the Turing machine, which can be considered a model of a general-purpose computer. During the Second World War, Turing worked at Bletchley Park, playing a pivotal role in cracking intercepted coded messages, notably the German Enigma machine, which saved millions of lives and shortened the war.",
    famousWorks: [
      { year: 1936, title: "On Computable Numbers, with an Application to the Entscheidungsproblem (Turing Machine concept)" },
      { year: 1940, title: "Design of the Bombe electromechanical cryptanalytic machine breaking the Enigma code" },
      { year: 1946, title: "Design of the Automatic Computing Engine (ACE), an early stored-program computer" },
      { year: 1950, title: "Computing Machinery and Intelligence (Introducing the Turing Test for Artificial Intelligence)" }
    ],
    awards: [
      "Officer of the Order of the British Empire (OBE, 1945)",
      "Fellow of the Royal Society (FRS, 1951)",
      "Royal Pardon granted by Queen Elizabeth II (2013)",
      "Commemorated on the UK Bank of England £50 banknote (2021)"
    ],
    faq: [
      {
        q: "What is the Turing Test?",
        a: "Introduced in 1950 as the 'Imitation Game', it tests whether a machine can exhibit intelligent behavior indistinguishable from that of a human through text conversation."
      },
      {
        q: "How did Turing help break the Enigma cipher?",
        a: "At Bletchley Park, Turing designed an electromechanical machine called the Bombe that tested thousands of possible rotor settings simultaneously, deciphering German military communications."
      }
    ],
    related: ["ada-lovelace", "john-von-neumann", "isaac-newton"],
    sources: [
      "https://en.wikipedia.org/wiki/Alan_Turing",
      "https://royalsociety.org/collections/alan-turing/"
    ],
    image: "/avatars/alan-turing.jpg",
    imageCredit: "Wikimedia Commons / Elliott & Fry (1951)"
  },
  {
    slug: "ada-lovelace",
    name: "Ada Lovelace",
    category: "scientists",
    profession: "Mathematician & Computer Pioneer",
    industry: "Computational Mathematics & Algorithmic Theory",
    country: "United Kingdom",
    birthDate: "1815-12-10",
    deathDate: "1852-11-27",
    birthPlace: "London, England",
    languages: ["English", "French"],
    nickname: "The Enchantress of Numbers",
    bio: "Augusta Ada King, Countess of Lovelace, was an English mathematician and writer chiefly known for her work on Charles Babbage's mechanical general-purpose computer, the Analytical Engine. She was the first to recognize that the machine had applications beyond pure calculation, and published the first algorithm intended to be carried out by such a machine. Because of this, she is celebrated worldwide as the world's first computer programmer.",
    famousWorks: [
      { year: 1843, title: "Notes on Luigi Menabrea's Sketch of the Analytical Engine (Including Note G: the first computer program)" },
      { year: 1842, title: "Theoretical formulation of computer music and multi-symbol manipulation" }
    ],
    awards: [
      "Ada programming language named in her honor by the United States Department of Defense (1980)",
      "British Computer Society Lovelace Medal established (1998)",
      "Annual Ada Lovelace Day celebrated internationally on the second Tuesday of October"
    ],
    faq: [
      {
        q: "What program did Ada Lovelace write?",
        a: "In 'Note G' of her 1843 paper, Lovelace detailed an algorithm for Babbage's Analytical Engine to compute Bernoulli numbers, containing the essential elements of modern software: sequencing, looping, and memory allocation."
      },
      {
        q: "Who was Ada Lovelace's famous father?",
        a: "She was the only legitimate child of the renowned Romantic poet Lord Byron and mathematician Anne Isabella Milbanke."
      }
    ],
    related: ["alan-turing", "john-von-neumann", "isaac-newton"],
    sources: [
      "https://en.wikipedia.org/wiki/Ada_Lovelace",
      "https://www.computerhistory.org/babbage/adalovelace/"
    ],
    image: "/avatars/ada-lovelace.jpg",
    imageCredit: "Wikimedia Commons / Margaret Sarah Carpenter (1836)"
  },
  {
    slug: "dmitri-mendeleev",
    name: "Dmitri Mendeleev",
    category: "scientists",
    profession: "Chemist & Inventor",
    industry: "Inorganic Chemistry & Chemical Periodicity",
    country: "Russia",
    birthDate: "1834-02-08",
    deathDate: "1907-02-02",
    birthPlace: "Verkhnie Aremzyani, Tobolsk Governorate, Russian Empire",
    languages: ["Russian", "German", "French"],
    nickname: "Father of the Periodic Table",
    bio: "Dmitri Ivanovich Mendeleev was a Russian chemist and inventor who formulated the Periodic Law and created a farsighted version of the periodic table of elements. Using the periodic law, he not only corrected the properties of some already-known elements but also predicted the properties of eight elements that were yet to be discovered (including gallium, germanium, and scandium), all of which were subsequently discovered and matched his predictions with uncanny precision.",
    famousWorks: [
      { year: 1869, title: "Formulation of the Periodic Table of Chemical Elements based on atomic weights" },
      { year: 1868, title: "Principles of Chemistry (Osnovy khimii, definitive 2-volume textbook)" },
      { year: 1871, title: "Exact prediction of undiscovered elements (eka-aluminum, eka-boron, and eka-silicon)" }
    ],
    awards: [
      "Davy Medal of the Royal Society (1882)",
      "Copley Medal of the Royal Society (1905)",
      "Demidov Prize (1862)",
      "Element 101 Mendelevium named in his honor (1955)"
    ],
    faq: [
      {
        q: "How did Mendeleev organize the periodic table?",
        a: "He organized elements in order of increasing atomic weight, grouping elements with similar chemical properties together into columns, and boldly left blank spaces where he believed undiscovered elements belonged."
      },
      {
        q: "What element is named after Dmitri Mendeleev?",
        a: "Chemical element 101, Mendelevium (Md), a synthetic radioactive actinide discovered in 1955, was named in his honor."
      }
    ],
    related: ["marie-curie", "louis-pasteur", "ernest-rutherford"],
    sources: [
      "https://en.wikipedia.org/wiki/Dmitri_Mendeleev",
      "https://royalsociety.org/collections/dmitri-mendeleev/"
    ],
    image: "/avatars/dmitri-mendeleev.jpg",
    imageCredit: "Wikimedia Commons / Ilya Repin (1885)"
  },
  {
    slug: "johannes-kepler",
    name: "Johannes Kepler",
    category: "scientists",
    profession: "Astronomer, Mathematician & Astrologer",
    industry: "Celestial Mechanics & Planetary Motion",
    country: "Germany",
    birthDate: "1571-12-27",
    deathDate: "1630-11-15",
    birthPlace: "Weil der Stadt, Holy Roman Empire",
    languages: ["German", "Latin"],
    nickname: "Founder of Celestial Mechanics",
    bio: "Johannes Kepler was a German astronomer, mathematician, and astrologer. He is a key figure in the 17th-century Scientific Revolution, best known for his laws of planetary motion, which provided one of the foundations for Isaac Newton's theory of universal gravitation. Kepler worked as an assistant to Tycho Brahe and later served as Imperial Mathematician to three Holy Roman Emperors, revolutionizing astronomy by abandoning circular planetary orbits in favor of ellipses.",
    famousWorks: [
      { year: 1609, title: "Astronomia Nova (Formulation of Kepler's First and Second Laws of Planetary Motion)" },
      { year: 1619, title: "Harmonices Mundi (Discovery of Kepler's Third Law connecting orbital periods and distances)" },
      { year: 1627, title: "Rudolphine Tables (Accurate planetary tables based on Tycho Brahe's observations)" },
      { year: 1611, title: "Dioptrice (Foundational work on optics and Keplerian astronomical telescopes)" }
    ],
    awards: [
      "Imperial Mathematician to Holy Roman Emperors Rudolf II, Matthias, and Ferdinand II (1601–1630)",
      "NASA Kepler Space Telescope named in his honor (2009)"
    ],
    faq: [
      {
        q: "What are Kepler's Three Laws of Planetary Motion?",
        a: "1) Planets orbit the Sun in ellipses with the Sun at one focus. 2) A line joining a planet and the Sun sweeps out equal areas during equal intervals of time. 3) The square of the orbital period of a planet is directly proportional to the cube of the semi-major axis of its orbit ($P^2 = a^3$)."
      },
      {
        q: "How did Kepler improve the telescope?",
        a: "In 1611, Kepler designed the Keplerian telescope using two convex lenses, which provided a much wider field of view and higher magnification than Galileo's concave-convex design, becoming the standard for refracting telescopes."
      }
    ],
    related: ["galileo-galilei", "isaac-newton", "albert-einstein"],
    sources: [
      "https://en.wikipedia.org/wiki/Johannes_Kepler",
      "https://plato.stanford.edu/entries/kepler/"
    ],
    image: "/avatars/johannes-kepler.jpg",
    imageCredit: "Wikimedia Commons / Unknown artist (1610)"
  },
  {
    slug: "max-planck",
    name: "Max Planck",
    category: "scientists",
    profession: "Theoretical Physicist",
    industry: "Quantum Physics & Thermodynamics",
    country: "Germany",
    birthDate: "1858-04-23",
    deathDate: "1947-10-04",
    birthPlace: "Kiel, Duchy of Holstein",
    languages: ["German", "Latin"],
    nickname: "Father of Quantum Theory",
    bio: "Max Karl Ernst Ludwig Planck was a German theoretical physicist whose discovery of energy quanta won him the Nobel Prize in Physics in 1918. Planck made many contributions to theoretical physics, but his fame rests primarily on his role as the originator of quantum theory, which revolutionized human understanding of atomic and subatomic processes. In 1900, to explain black-body radiation, Planck proposed that energy is emitted or absorbed in discrete packets called quanta ($E = h\\nu$), introducing the fundamental physical constant known as Planck's constant ($h$).",
    famousWorks: [
      { year: 1900, title: "Planck's Law of Black-Body Radiation (Introduction of the quantum of action, h)" },
      { year: 1897, title: "Treatise on Thermodynamics (Lectures on entropy and the second law of thermodynamics)" },
      { year: 1906, title: "Vorlesungen über die Theorie der Wärmestrahlung (The Theory of Heat Radiation)" }
    ],
    awards: [
      "Nobel Prize in Physics (1918)",
      "Pour le Mérite for Sciences and Arts (1915)",
      "Copley Medal of the Royal Society (1929)",
      "Max Planck Medal (1929)",
      "Goethe Prize (1945)"
    ],
    faq: [
      {
        q: "What is Planck's constant?",
        a: "Denoted by h ($6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}$), it relates the energy of a photon to its frequency ($E = h\\nu$). It is one of the fundamental constants of nature and forms the scale of quantum mechanical phenomena."
      },
      {
        q: "What is the Max Planck Society?",
        a: "Germany's premier non-governmental research organization, founded in 1948 as the successor to the Kaiser Wilhelm Society, named in honor of Max Planck. Its researchers have produced dozens of Nobel laureates."
      }
    ],
    related: ["albert-einstein", "niels-bohr", "werner-heisenberg"],
    sources: [
      "https://en.wikipedia.org/wiki/Max_Planck",
      "https://www.nobelprize.org/prizes/physics/1918/planck/biographical/"
    ],
    image: "/avatars/max-planck.jpg",
    imageCredit: "Wikimedia Commons / Hugo Erfurth (1918)"
  },
  {
    slug: "ernest-rutherford",
    name: "Ernest Rutherford",
    category: "scientists",
    profession: "Physicist & Chemist",
    industry: "Nuclear Physics & Radioactivity",
    country: "New Zealand",
    birthDate: "1871-08-30",
    deathDate: "1937-10-19",
    birthPlace: "Brightwater, Colony of New Zealand",
    languages: ["English"],
    nickname: "Father of Nuclear Physics",
    bio: "Ernest Rutherford, 1st Baron Rutherford of Nelson, was a New Zealand-born British physicist who came to be known as the father of nuclear physics. In 1911, he led the famous Geiger–Marsden gold foil experiment, which demonstrated that atoms consist of a tiny, dense, positively charged nucleus surrounded by orbiting electrons, overturning J.J. Thomson's plum pudding model. In 1919, Rutherford achieved the world's first artificial nuclear transmutation by bombarding nitrogen gas with alpha particles, converting it into oxygen and discovering the proton.",
    famousWorks: [
      { year: 1899, title: "Discovery and naming of Alpha and Beta radioactivity" },
      { year: 1911, title: "Rutherford Model of the Atom (Discovery of the atomic nucleus via gold foil experiment)" },
      { year: 1919, title: "First artificial nuclear transmutation and discovery of the proton" },
      { year: 1920, title: "Theoretical prediction of the neutron (later discovered by his student James Chadwick in 1932)" }
    ],
    awards: [
      "Nobel Prize in Chemistry (1908)",
      "Rumford Medal (1905)",
      "Copley Medal of the Royal Society (1922)",
      "Franklin Medal (1924)",
      "President of the Royal Society (1925–1930)"
    ],
    faq: [
      {
        q: "Why did Ernest Rutherford win the Nobel Prize in Chemistry rather than Physics?",
        a: "He won the 1908 Nobel Prize in Chemistry 'for his investigations into the disintegration of the elements, and the chemistry of radioactive substances', establishing that radioactivity involves the spontaneous transmutation of one chemical element into another."
      },
      {
        q: "What was the significance of the Gold Foil Experiment?",
        a: "By firing alpha particles at a thin gold foil and observing that a tiny fraction deflected at angles greater than 90 degrees, Rutherford deduced that nearly all the mass and positive charge of an atom is concentrated in an unimaginably compact central nucleus."
      }
    ],
    related: ["marie-curie", "niels-bohr", "j-robert-oppenheimer"],
    sources: [
      "https://en.wikipedia.org/wiki/Ernest_Rutherford",
      "https://www.nobelprize.org/prizes/chemistry/1908/rutherford/biographical/"
    ],
    image: "/avatars/ernest-rutherford.jpg",
    imageCredit: "Wikimedia Commons / Bain News Service (1910)"
  },
  {
    slug: "rosalind-franklin",
    name: "Rosalind Franklin",
    category: "scientists",
    profession: "Chemist & X-ray Crystallographer",
    industry: "Molecular Biology & Structural Chemistry",
    country: "United Kingdom",
    birthDate: "1920-07-25",
    deathDate: "1958-04-16",
    birthPlace: "Notting Hill, London, England",
    languages: ["English", "French"],
    nickname: "The Dark Lady of DNA",
    bio: "Rosalind Elsie Franklin was an English chemist and X-ray crystallographer whose work was central to the understanding of the molecular structures of DNA, RNA, viruses, coal, and graphite. Her X-ray diffraction images of DNA, particularly the iconic Photo 51 taken by her student Raymond Gosling under her direction, provided the critical empirical evidence that enabled James Watson and Francis Crick to deduce the double-helix structure of DNA in 1953. Franklin later led pioneering research on the molecular structures of plant and human viruses, including Tobacco Mosaic Virus and Poliovirus.",
    famousWorks: [
      { year: 1952, title: "Photo 51 (X-ray diffraction photograph confirming the B-form helical structure of DNA)" },
      { year: 1953, title: "Determination that DNA phosphates lie on the outside of the helical backbone" },
      { year: 1955, title: "Elucidation of the hollow tube helical structure of the Tobacco Mosaic Virus (TMV)" }
    ],
    awards: [
      "Royal Society Rosalind Franklin Award established in her honor (2003)",
      "Rosalind Franklin University of Medicine and Science named in her honor (2004)",
      "ESA ExoMars rover named 'Rosalind Franklin' (2019)"
    ],
    faq: [
      {
        q: "What was Photo 51?",
        a: "Photo 51 was an exceptionally clear X-ray diffraction image of hydrated sodium deoxyribonucleate (B-form DNA) captured in May 1952. The clear 'X' pattern proved that DNA is arranged in a helical structure."
      },
      {
        q: "Why didn't Rosalind Franklin receive a Nobel Prize?",
        a: "The Nobel Prize is not awarded posthumously. Franklin died of ovarian cancer in 1958 at the age of 37, four years before James Watson, Francis Crick, and Maurice Wilkins received the 1962 Nobel Prize in Physiology or Medicine."
      }
    ],
    related: ["marie-curie", "charles-darwin", "gregor-mendel"],
    sources: [
      "https://en.wikipedia.org/wiki/Rosalind_Franklin",
      "https://royalsociety.org/awards/rosalind-franklin-award/"
    ],
    image: "/avatars/rosalind-franklin.jpg",
    imageCredit: "Wikimedia Commons / MRC Laboratory of Molecular Biology (1955)"
  },
  {
    slug: "gregor-mendel",
    name: "Gregor Mendel",
    category: "scientists",
    profession: "Biologist, Meteorologist & Augustinian Abbot",
    industry: "Genetics & Botany",
    country: "Austrian Empire",
    birthDate: "1822-07-20",
    deathDate: "1884-01-06",
    birthPlace: "Hynčice, Austrian Empire (modern-day Czech Republic)",
    languages: ["German", "Czech", "Latin"],
    nickname: "Father of Modern Genetics",
    bio: "Gregor Johann Mendel was an Austrian-Czech biologist, meteorologist, mathematician, and Augustinian friar who gained posthumous fame as the founder of the modern science of genetics. Through systematic cross-breeding experiments with approximately 28,000 pea plants (Pisum sativum) between 1856 and 1863 in the monastery garden at St. Thomas's Abbey in Brno, Mendel discovered the fundamental laws of inheritance. He established that traits are inherited as discrete, particulate units (now known as genes) according to specific mathematical ratios.",
    famousWorks: [
      { year: 1866, title: "Versuche über Pflanzen-Hybriden (Experiments on Plant Hybridization)" },
      { year: 1869, title: "Formulation of the Law of Segregation and the Law of Independent Assortment" }
    ],
    awards: [
      "Abbot of St. Thomas's Abbey in Brno (1868–1884)",
      "Mendel Medal established by the Genetics Society (1958)",
      "Gregor Mendel Institute of Molecular Plant Biology named in his honor"
    ],
    faq: [
      {
        q: "What are Mendel's two primary laws of inheritance?",
        a: "1) The Law of Segregation: Every individual possesses two alleles for each gene, which separate during gamete formation so each gamete carries only one allele. 2) The Law of Independent Assortment: Genes for different traits sort independently of one another during the formation of gametes."
      },
      {
        q: "Why was Mendel's work overlooked during his lifetime?",
        a: "His 1866 paper used advanced mathematical and statistical models that biologists of the 19th century were not accustomed to using, and it was published in a regional Moravian journal with limited distribution until its dramatic rediscovery in 1900 by Hugo de Vries, Carl Correns, and Erich von Tschermak."
      }
    ],
    related: ["charles-darwin", "rosalind-franklin", "louis-pasteur"],
    sources: [
      "https://en.wikipedia.org/wiki/Gregor_Mendel",
      "https://www.nature.com/scitable/topicpage/gregor-mendel-and-the-principles-of-inheritance-593/"
    ],
    image: "/avatars/gregor-mendel.jpg",
    imageCredit: "Wikimedia Commons / St. Thomas's Abbey (c. 1862)"
  },
  {
    slug: "erwin-schrodinger",
    name: "Erwin Schrödinger",
    category: "scientists",
    profession: "Theoretical Physicist",
    industry: "Quantum Mechanics & Wave Dynamics",
    country: "Austria",
    birthDate: "1887-08-12",
    deathDate: "1961-01-04",
    birthPlace: "Vienna, Austria-Hungary",
    languages: ["German", "English", "Italian", "Spanish", "French"],
    nickname: "Master of Wave Mechanics",
    bio: "Erwin Rudolf Josef Alexander Schrödinger was an Austrian theoretical physicist who made profound contributions to quantum theory, forming the basis of wave mechanics. In 1926, he formulated the wave equation (Schrödinger equation) that calculates the energy levels of electrons in atoms and accurately describes the evolution of quantum systems. In 1935, after correspondence with Albert Einstein, he proposed the thought experiment known as Schrödinger's cat to illustrate the paradoxical nature of the Copenhagen interpretation. His 1944 book What Is Life? inspired the discovery of DNA.",
    famousWorks: [
      { year: 1926, title: "Formulation of the Schrödinger Wave Equation in 'Quantisierung als Eigenwertproblem'" },
      { year: 1935, title: "Schrödinger's Cat Thought Experiment (Exploring quantum superposition and entanglement)" },
      { year: 1944, title: "What Is Life? The Physical Aspect of the Living Cell (Proposing genetic code in an aperiodic crystal)" }
    ],
    awards: [
      "Nobel Prize in Physics (1933)",
      "Matteucci Medal (1927)",
      "Max Planck Medal (1937)",
      "Erwin Schrödinger Prize of the Austrian Academy of Sciences established (1958)"
    ],
    faq: [
      {
        q: "What is the Schrödinger's Cat paradox?",
        a: "It is a thought experiment where a hypothetical cat inside a sealed box is simultaneously alive and dead (in quantum superposition) linked to a random subatomic event, until an observer opens the box and forces the quantum state to collapse."
      },
      {
        q: "What is the Schrödinger equation?",
        a: "It is a linear partial differential equation ($i\\hbar \\frac{\\partial}{\\partial t} |\\psi(t)\\rangle = \\hat{H} |\\psi(t)\\rangle$) that governs the wave function of a quantum-mechanical system, playing the same central role in quantum physics that Newton's second law plays in classical mechanics."
      }
    ],
    related: ["werner-heisenberg", "niels-bohr", "albert-einstein"],
    sources: [
      "https://en.wikipedia.org/wiki/Erwin_Schr%C3%B6dinger",
      "https://www.nobelprize.org/prizes/physics/1933/schrodinger/biographical/"
    ],
    image: "/avatars/erwin-schrodinger.jpg",
    imageCredit: "Wikimedia Commons / Nobel Foundation (1933)"
  },
  {
    slug: "j-robert-oppenheimer",
    name: "J. Robert Oppenheimer",
    category: "scientists",
    profession: "Theoretical Physicist",
    industry: "Theoretical Physics & Nuclear Weapons",
    country: "United States",
    birthDate: "1904-04-22",
    deathDate: "1967-02-18",
    birthPlace: "New York City, USA",
    languages: ["English", "German", "French", "Latin", "Greek", "Sanskrit", "Dutch"],
    nickname: "Father of the Atomic Bomb",
    bio: "J. Robert Oppenheimer was an American theoretical physicist and director of the Manhattan Project's Los Alamos Laboratory during World War II. Widely known as the 'father of the atomic bomb', he led the scientific effort that developed the first nuclear weapons, successfully tested at the Trinity site in New Mexico in July 1945. Oppenheimer made foundational contributions to quantum mechanics and nuclear physics, including the Born–Oppenheimer approximation and early theoretical models of black holes and gravitational collapse.",
    famousWorks: [
      { year: 1927, title: "Born–Oppenheimer Approximation (Decoupling nuclear and electronic motions in molecules)" },
      { year: 1939, title: "On Continued Gravitational Contraction (Pioneering mathematical model of black hole formation)" },
      { year: 1945, title: "Scientific Direction of the Manhattan Project & Trinity Nuclear Test" },
      { year: 1947, title: "Director of the Institute for Advanced Study in Princeton (1947–1966)" }
    ],
    awards: [
      "Medal for Merit conferred by President Harry S. Truman (1946)",
      "Enrico Fermi Award presented by President Lyndon B. Johnson (1963)",
      "Honorary Knight Commander of the Order of the British Empire (KBE, 1948)"
    ],
    faq: [
      {
        q: "What famous quotation did Oppenheimer recall upon seeing the Trinity test?",
        a: "He recalled a verse from the Hindu scripture Bhagavad Gita: 'Now I am become Death, the destroyer of worlds.'"
      },
      {
        q: "What was Oppenheimer's security hearing in 1954?",
        a: "At the height of the Red Scare, Oppenheimer was stripped of his security clearance following a controversial hearing due to his past associations with left-wing figures and his outspoken opposition to the development of the hydrogen bomb. The US Department of Energy officially vacated that decision in 2022."
      }
    ],
    related: ["enrico-fermi", "albert-einstein", "richard-feynman"],
    sources: [
      "https://en.wikipedia.org/wiki/J._Robert_Oppenheimer",
      "https://www.ias.edu/oppenheimer"
    ],
    image: "/avatars/j-robert-oppenheimer.jpg",
    imageCredit: "Wikimedia Commons / Los Alamos National Laboratory (c. 1944)"
  },
  {
    slug: "enrico-fermi",
    name: "Enrico Fermi",
    category: "scientists",
    profession: "Theoretical & Experimental Physicist",
    industry: "Nuclear Physics & Quantum Statistics",
    country: "Italy",
    birthDate: "1901-09-29",
    deathDate: "1954-11-28",
    birthPlace: "Rome, Kingdom of Italy",
    languages: ["Italian", "English", "German", "French"],
    nickname: "Architect of the Nuclear Age",
    bio: "Enrico Fermi was an Italian and naturalized-American physicist and the creator of the world's first artificial nuclear reactor, the Chicago Pile-1. He has been called the 'architect of the nuclear age' and the 'architect of the atomic bomb'. Fermi was one of the very few physicists in history to excel equally in both theoretical physics and experimental physics. He was awarded the 1938 Nobel Prize in Physics for his work on induced radioactivity by neutron bombardment and for the discovery of transuranic elements.",
    famousWorks: [
      { year: 1926, title: "Formulation of Fermi–Dirac Statistics (Governing particles obeying the Pauli exclusion principle)" },
      { year: 1933, title: "Fermi's Theory of Beta Decay (Introducing the weak nuclear interaction)" },
      { year: 1942, title: "Construction and operation of Chicago Pile-1 (First self-sustaining nuclear chain reaction)" }
    ],
    awards: [
      "Nobel Prize in Physics (1938)",
      "Hughes Medal of the Royal Society (1942)",
      "Medal for Merit (1946)",
      "Franklin Medal (1947)",
      "Max Planck Medal (1954)"
    ],
    faq: [
      {
        q: "What is the Fermi Paradox?",
        a: "It is the apparent contradiction between the high statistical probability of extraterrestrial civilizations existing in the universe and the complete lack of evidence for or contact with such civilizations, famously phrased by Fermi as 'Where is everybody?'"
      },
      {
        q: "What subatomic particle class is named after Enrico Fermi?",
        a: "Fermions, which include all particles with half-integer spin such as quarks, electrons, protons, and neutrons, obey Fermi–Dirac statistics and cannot occupy the same quantum state simultaneously."
      }
    ],
    related: ["j-robert-oppenheimer", "werner-heisenberg", "niels-bohr"],
    sources: [
      "https://en.wikipedia.org/wiki/Enrico_Fermi",
      "https://www.nobelprize.org/prizes/physics/1938/fermi/biographical/"
    ],
    image: "/avatars/enrico-fermi.jpg",
    imageCredit: "Wikimedia Commons / Department of Energy (c. 1940s)"
  },
  {
    slug: "werner-heisenberg",
    name: "Werner Heisenberg",
    category: "scientists",
    profession: "Theoretical Physicist",
    industry: "Quantum Mechanics & Matrix Mechanics",
    country: "Germany",
    birthDate: "1901-12-05",
    deathDate: "1976-02-01",
    birthPlace: "Würzburg, Kingdom of Bavaria, German Empire",
    languages: ["German", "English", "Ancient Greek", "Latin"],
    nickname: "Pioneer of Quantum Mechanics",
    bio: "Werner Karl Heisenberg was a German theoretical physicist and one of the main pioneers of quantum mechanics. In 1925, he published a breakthrough paper establishing matrix mechanics, the first complete mathematical formulation of quantum mechanics. In 1927, he published his famous Uncertainty Principle, which states that the more precisely the position of a subatomic particle is determined, the less precisely its momentum can be known. Heisenberg was awarded the 1932 Nobel Prize in Physics 'for the creation of quantum mechanics'.",
    famousWorks: [
      { year: 1925, title: "Formulation of Matrix Mechanics (With Max Born and Pascual Jordan)" },
      { year: 1927, title: "The Uncertainty Principle (Delta x * Delta p >= h-bar / 2)" },
      { year: 1932, title: "Proton-Neutron Model of the Atomic Nucleus" },
      { year: 1943, title: "S-Matrix Theory in Particle Scattering" }
    ],
    awards: [
      "Nobel Prize in Physics (1932)",
      "Matteucci Medal (1929)",
      "Max Planck Medal (1933)",
      "Pour le Mérite for Sciences and Arts (1957)"
    ],
    faq: [
      {
        q: "What does the Heisenberg Uncertainty Principle state?",
        a: "It states a fundamental limit to the accuracy with which certain pairs of physical properties of a particle, such as position ($x$) and momentum ($p$), can be simultaneously known: $\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}$."
      },
      {
        q: "What was Heisenberg's role in World War II?",
        a: "He led the German nuclear energy program (Uranverein), which conducted research into nuclear reactors and fission, although they never came close to building an atomic bomb."
      }
    ],
    related: ["niels-bohr", "erwin-schrodinger", "max-planck"],
    sources: [
      "https://en.wikipedia.org/wiki/Werner_Heisenberg",
      "https://www.nobelprize.org/prizes/physics/1932/heisenberg/biographical/"
    ],
    image: "/avatars/werner-heisenberg.jpg",
    imageCredit: "Wikimedia Commons / German Federal Archives (1933)"
  },
  {
    slug: "linus-pauling",
    name: "Linus Pauling",
    category: "scientists",
    profession: "Chemist, Biochemist & Peace Activist",
    industry: "Chemical Bonding & Molecular Biology",
    country: "United States",
    birthDate: "1901-02-28",
    deathDate: "1994-08-19",
    birthPlace: "Portland, Oregon, USA",
    languages: ["English", "German"],
    nickname: "Architect of the Chemical Bond",
    bio: "Linus Carl Pauling was an American chemist, biochemist, chemical engineer, peace activist, and author. He was one of the founders of the fields of quantum chemistry and molecular biology. Pauling is one of only four individuals to have won more than one Nobel Prize, and is the only person to have been awarded two unshared Nobel Prizes: the 1954 Nobel Prize in Chemistry for his research into the nature of the chemical bond, and the 1962 Nobel Peace Prize for his tireless international campaign against above-ground nuclear weapons testing.",
    famousWorks: [
      { year: 1939, title: "The Nature of the Chemical Bond (Seminal treatise applying quantum mechanics to chemistry)" },
      { year: 1949, title: "Sickle Cell Anemia, a Molecular Disease (First disease traced to an abnormal protein)" },
      { year: 1951, title: "Discovery of the Alpha-Helix and Beta-Sheet secondary structures of proteins" },
      { year: 1958, title: "No More War! (Global petition signed by 11,000 scientists against nuclear testing)" }
    ],
    awards: [
      "Nobel Prize in Chemistry (1954)",
      "Nobel Peace Prize (1962)",
      "Presidential Medal of Merit (1948)",
      "Priestley Medal of the American Chemical Society (1984)",
      "National Medal of Science (1974)"
    ],
    faq: [
      {
        q: "What unique Nobel Prize record does Linus Pauling hold?",
        a: "He is the only person in history to win two undivided (unshared) Nobel Prizes: the 1954 Nobel Prize in Chemistry and the 1962 Nobel Peace Prize."
      },
      {
        q: "What is the alpha helix in biology?",
        a: "Discovered by Pauling in 1951, the alpha helix is a right-handed coil structure in proteins stabilized by hydrogen bonding between amino acid residues, forming the building block of hair, wool, muscle, and hemoglobin."
      }
    ],
    related: ["marie-curie", "rosalind-franklin", "albert-einstein"],
    sources: [
      "https://en.wikipedia.org/wiki/Linus_Pauling",
      "https://www.nobelprize.org/prizes/chemistry/1954/pauling/biographical/"
    ],
    image: "/avatars/linus-pauling.jpg",
    imageCredit: "Wikimedia Commons / Nobel Foundation (1954)"
  },
  {
    slug: "john-von-neumann",
    name: "John von Neumann",
    category: "scientists",
    profession: "Mathematician, Physicist & Computer Scientist",
    industry: "Game Theory & Computer Architecture",
    country: "United States",
    birthDate: "1903-12-28",
    deathDate: "1957-02-08",
    birthPlace: "Budapest, Kingdom of Hungary",
    languages: ["Hungarian", "English", "German", "French", "Latin", "Ancient Greek"],
    nickname: "The Last Universal Polymath",
    bio: "John von Neumann was a Hungarian-American mathematician, physicist, computer scientist, engineer, and polymath. Regarded as one of the foremost mathematicians of the 20th century, he made major contributions to pure mathematics, quantum mechanics (operator algebras), economics (game theory), statistics, nuclear physics, and computing. In 1945, he authored the First Draft of a Report on the EDVAC, establishing the von Neumann architecture with shared memory for data and instructions that remains the architectural standard for modern computers.",
    famousWorks: [
      { year: 1932, title: "Mathematical Foundations of Quantum Mechanics (Rigorous Hilbert space formulation)" },
      { year: 1944, title: "Theory of Games and Economic Behavior (Foundational book written with Oskar Morgenstern)" },
      { year: 1945, title: "First Draft of a Report on the EDVAC (Formulation of the Von Neumann Architecture)" },
      { year: 1951, title: "Theory of Self-Reproducing Automata (Founding cellular automata)" }
    ],
    awards: [
      "Bôcher Memorial Prize of the American Mathematical Society (1938)",
      "Presidential Medal for Merit (1946)",
      "Medal of Freedom presented by President Dwight D. Eisenhower (1956)",
      "Enrico Fermi Award (1956)"
    ],
    faq: [
      {
        q: "What is the Von Neumann Architecture?",
        a: "It is a theoretical design architecture for an electronic digital computer consisting of a central processing unit (ALU and registers), a control unit, memory storing both instructions and data, external mass storage, and input/output mechanisms."
      },
      {
        q: "What is game theory?",
        a: "Co-founded by von Neumann in 1944, game theory is the study of mathematical models of strategic interactions among rational decision-makers, widely applied across economics, evolutionary biology, political science, and artificial intelligence."
      }
    ],
    related: ["alan-turing", "ada-lovelace", "j-robert-oppenheimer"],
    sources: [
      "https://en.wikipedia.org/wiki/John_von_Neumann",
      "https://www.ias.edu/scholars/john-von-neumann"
    ],
    image: "/avatars/john-von-neumann.jpg",
    imageCredit: "Wikimedia Commons / Los Alamos National Laboratory (c. 1940s)"
  },
  {
    slug: "archimedes",
    name: "Archimedes",
    category: "scientists",
    profession: "Mathematician, Physicist & Engineer",
    industry: "Classical Geometry & Hydrostatics",
    country: "Ancient Greece",
    birthDate: "-0287-01-01",
    deathDate: "-0212-01-01",
    birthPlace: "Syracuse, Magna Graecia (Sicily)",
    languages: ["Ancient Greek (Doric)"],
    nickname: "Father of Mathematics",
    bio: "Archimedes of Syracuse was an Ancient Greek mathematician, physicist, engineer, astronomer, and inventor. Although few details of his life are known, he is regarded as one of the leading scientists in classical antiquity and one of the greatest mathematicians of all time. Archimedes anticipated modern calculus and analysis by applying concepts of infinitesimals and the method of exhaustion to derive a range of geometrical theorems, including the area of a circle, the surface area and volume of a sphere, and the area under a parabola.",
    famousWorks: [
      { year: -250, title: "On Floating Bodies (Formulation of Archimedes' principle of buoyancy)" },
      { year: -240, title: "On the Sphere and Cylinder (Proving the volume ratio between sphere and circumscribed cylinder is 2:3)" },
      { year: -230, title: "Measurement of a Circle (Bounding pi between 223/71 and 22/7)" },
      { year: -225, title: "The Sand Reckoner (Estimating the number of grains of sand required to fill the universe)" }
    ],
    awards: [
      "Chief Scientific Advisor to King Hiero II of Syracuse",
      "Immortalized by fields like the Fields Medal portraying his likeness with the motto 'Transire suum pectus mundoque potiri'"
    ],
    faq: [
      {
        q: "What is Archimedes' Principle?",
        a: "It states that any body completely or partially submerged in a fluid at rest is acted upon by an upward buoyant force equal to the weight of the fluid displaced by the body. According to legend, Archimedes discovered this in a bath and ran shouting 'Eureka!' ('I have found it!')."
      },
      {
        q: "What was the Archimedes screw?",
        a: "A mechanical device consisting of a revolving screw-shaped surface inside a pipe, used since antiquity to lift water efficiently for irrigation and drainage."
      }
    ],
    related: ["galileo-galilei", "isaac-newton", "aristotle"],
    sources: [
      "https://en.wikipedia.org/wiki/Archimedes",
      "https://mathshistory.st-andrews.ac.uk/Biographies/Archimedes/"
    ],
    image: "/avatars/archimedes.jpg",
    imageCredit: "Wikimedia Commons / Domenico Fetti (1620)"
  },
  {
    slug: "aristotle",
    name: "Aristotle",
    category: "scientists",
    profession: "Philosopher & Natural Scientist",
    industry: "Natural Philosophy & Biology",
    country: "Ancient Greece",
    birthDate: "-0384-01-01",
    deathDate: "-0322-01-01",
    birthPlace: "Stageira, Chalcidice, Greece",
    languages: ["Ancient Greek"],
    nickname: "The Master of Those Who Know",
    bio: "Aristotle was an Ancient Greek philosopher and polymath whose writings covered many subjects including physics, biology, zoology, metaphysics, logic, ethics, aesthetics, poetry, theater, music, rhetoric, and politics. A student of Plato and tutor to Alexander the Great, Aristotle founded the Lyceum and the Peripatetic school of philosophy. His pioneering empirical studies of marine life on the island of Lesbos established the discipline of zoological classification and the foundations of biology for over two millennia.",
    famousWorks: [
      { year: -350, title: "Historia Animalium (History of Animals: Pioneer taxonomy and empirical zoology)" },
      { year: -350, title: "Organon (Foundational treatises establishing formal deductive logic and syllogism)" },
      { year: -340, title: "Physics (Foundational study of motion, matter, causality, and time)" },
      { year: -330, title: "Nicomachean Ethics (Virtue ethics and human flourishing / Eudaimonia)" }
    ],
    awards: [
      "Tutor to Alexander the Great (343 BC)",
      "Founder of the Lyceum in Athens (335 BC)",
      "Revered across Western, Islamic, and Byzantine traditions as 'The Philosopher'"
    ],
    faq: [
      {
        q: "What were Aristotle's contributions to biology?",
        a: "Aristotle systematically dissected and cataloged more than 500 animal species, accurately detailing the development of chick embryos, the complex stomachs of ruminants, and the reproductive habits of cuttlefish and sharks."
      },
      {
        q: "What is an Aristotelian syllogism?",
        a: "A form of deductive reasoning where a conclusion is drawn from two given or assumed premises: e.g., 'All humans are mortal (major premise); Socrates is human (minor premise); therefore, Socrates is mortal (conclusion).'"
      }
    ],
    related: ["archimedes", "galileo-galilei", "isaac-newton"],
    sources: [
      "https://en.wikipedia.org/wiki/Aristotle",
      "https://plato.stanford.edu/entries/aristotle/"
    ],
    image: "/avatars/aristotle.jpg",
    imageCredit: "Wikimedia Commons / Lysippos bust at the Louvre (c. 330 BC)"
  },
  {
    slug: "subrahmanyan-chandrasekhar",
    name: "Subrahmanyan Chandrasekhar",
    category: "scientists",
    profession: "Astrophysicist & Applied Mathematician",
    industry: "Stellar Structure & Black Hole Physics",
    country: "India",
    birthDate: "1910-10-19",
    deathDate: "1995-08-21",
    birthPlace: "Lahore, Punjab, British India (modern-day Pakistan)",
    languages: ["Tamil", "English", "German"],
    nickname: "Architect of Stellar Evolution",
    bio: "Subrahmanyan Chandrasekhar was an Indian-American theoretical astrophysicist who spent his professional life in the United States. He shared the 1983 Nobel Prize in Physics with William A. Fowler for mathematical studies of the physical processes of importance to the structure and evolution of the stars. In 1930, at the age of just nineteen, Chandrasekhar calculated the maximum mass of a stable white dwarf star (the Chandrasekhar limit, ~1.44 solar masses), beyond which gravitational collapse forces the star into a neutron star or black hole.",
    famousWorks: [
      { year: 1930, title: "Calculation of the Chandrasekhar Limit for White Dwarf Stars (1.44 Solar Masses)" },
      { year: 1939, title: "An Introduction to the Study of Stellar Structure" },
      { year: 1950, title: "Radiative Transfer (Formulating mathematical physics of planetary and stellar atmospheres)" },
      { year: 1983, title: "The Mathematical Theory of Black Holes" }
    ],
    awards: [
      "Nobel Prize in Physics (1983)",
      "Henry Norris Russell Lectureship (1949)",
      "Bruce Medal of the Astronomical Society of the Pacific (1952)",
      "National Medal of Science (1966)",
      "Copley Medal of the Royal Society (1984)",
      "NASA Chandra X-ray Observatory named in his honor (1999)"
    ],
    faq: [
      {
        q: "What is the Chandrasekhar limit?",
        a: "It is the maximum possible mass of a stable white dwarf star, equal to approximately 1.44 times the mass of the Sun ($1.44 M_\\odot$). Stars exceeding this limit cannot be supported by electron degeneracy pressure and collapse into neutron stars or black holes."
      },
      {
        q: "What space telescope was named after Chandrasekhar?",
        a: "NASA's flagship Chandra X-ray Observatory, launched aboard Space Shuttle Columbia in 1999, was named in honor of Subrahmanyan Chandrasekhar."
      }
    ],
    related: ["albert-einstein", "stephen-hawking", "carl-sagan"],
    sources: [
      "https://en.wikipedia.org/wiki/Subrahmanyan_Chandrasekhar",
      "https://www.nobelprize.org/prizes/physics/1983/chandrasekhar/biographical/"
    ],
    image: "/avatars/subrahmanyan-chandrasekhar.jpg",
    imageCredit: "Wikimedia Commons / University of Chicago (1983)"
  }
];

const combined = [...existing, ...newScientists];

// Validate unique slugs
const slugs = new Set();
for (const p of combined) {
  if (slugs.has(p.slug)) {
    console.error('DUPLICATE SLUG:', p.slug);
    process.exit(1);
  }
  slugs.add(p.slug);
}

fs.writeFileSync('data/profiles/scientists.json', JSON.stringify(combined, null, 2) + '\n', 'utf8');
console.log('Successfully wrote', combined.length, 'scientists to data/profiles/scientists.json');

