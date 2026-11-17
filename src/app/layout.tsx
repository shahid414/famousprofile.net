import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  metadataBase: new URL("https://profilebook.org"),
  title: {
    default: "ProfileBook - Discover Profiles of Famous People Worldwide",
    template: "%s | ProfileBook",
  },
  description:
    "Explore comprehensive profiles, career achievements, quick facts, awards, and biographies of famous people from every industry worldwide.",
  keywords: [
    "famous people",
    "celebrity profiles",
    "biographies",
    "world leaders",
    "scientists",
    "cricketers",
    "footballers",
    "actors",
    "singers",
    "inventors",
  ],
  authors: [{ name: "ProfileBook Editorial Team" }],
  creator: "ProfileBook",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://profilebook.org",
    siteName: "ProfileBook",
    title: "ProfileBook - Famous People Directory Worldwide",
    description:
      "Explore curated profiles, biographies, and career highlights of iconic figures from arts, science, sports, and business.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProfileBook - Famous People Directory Worldwide",
    description:
      "Explore curated profiles, biographies, and career highlights of iconic figures worldwide.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  verification: {
    google: "googlef5c0a094e987a3bb",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }

                  if (sessionStorage.getItem('profilebook_splash_seen')) {
                    document.documentElement.classList.add('splash-hidden');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <SplashScreen />
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

