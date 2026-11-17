import { permanentRedirect } from "next/navigation";
import { getAllProfiles } from "@/lib/data";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const profiles = getAllProfiles();
  return profiles.map((p) => ({
    slug: p.slug,
  }));
}

export default function LegacyProfileRedirect({ params }: Props) {
  permanentRedirect(`/people/${params.slug}`);
}
