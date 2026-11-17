import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import WikiLiveSearch from "@/components/WikiLiveSearch";

export const metadata: Metadata = {
  title: "Live Wikipedia Search - Search Millions of Biographies",
  description: "Instant dynamic search querying the official English Wikipedia MediaWiki REST API on-demand with zero database storage.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WikiSearchPage() {
  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Search", href: "/search" },
          { label: "Live Wikipedia Search" },
        ]}
      />

      <div className="py-4">
        <WikiLiveSearch />
      </div>
    </div>
  );
}

