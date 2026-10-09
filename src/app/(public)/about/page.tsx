
import { URLS } from "@/config/urls";
import { getTranslation } from "@/i18n/server";
import type { Metadata } from "next";
import AboutPageClient from "./about-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();

  return {
    title: `${t("About")} | ArtCatalog`,
    description: t(
      "Learn about ArtCatalog — a curated platform dedicated to showcasing contemporary artworks and artists.",
    ),
    alternates: {
      canonical: `${URLS.artCatalog}/about`,
    },
  };
}

export default function AboutPage() {
  return <AboutPageClient />;
}
