export interface FamousWork {
  year: number | string;
  title: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface Profile {
  slug: string;
  name: string;
  category: string;
  profession: string;
  industry?: string;
  country: string;
  birthDate: string;
  deathDate?: string;
  birthPlace: string;
  languages: string[];
  nickname: string;
  bio: string;
  famousWorks: FamousWork[];
  awards: string[];
  faq: FAQItem[];
  related: string[];
  sources: string[];
  image: string;
  imageCredit: string;
}

export interface Category {
  slug: string;
  title: string;
  seoDescription: string;
  icon: string;
}

