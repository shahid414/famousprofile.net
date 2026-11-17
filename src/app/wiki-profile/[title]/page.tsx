import { permanentRedirect } from "next/navigation";

interface Props {
  params: {
    title: string;
  };
}

export default function LegacyWikiProfileRedirect({ params }: Props) {
  const slug = decodeURIComponent(params.title).toLowerCase().replace(/[\s_]+/g, "-");
  permanentRedirect(`/people/${slug}`);
}
