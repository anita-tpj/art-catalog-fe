import { getTranslation } from "@/i18n/server";
import { URLS } from "@/lib/config";
import type { Metadata } from "next";
import { ContactPageClient } from "./contact-page-client";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();

  return {
    title: `${t("Contact")} | ArtCatalog`,
    description: t(
      "Get in touch with ArtCatalog for inquiries, collaborations, or questions about artworks and artists.",
    ),
    alternates: {
      canonical: `${URLS.artCatalog}/contact`,
    },
  };
}

export default async function ContactPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const artworkId = sp.artworkId ? Number(sp.artworkId) : undefined;
  const artistId = sp.artistId ? Number(sp.artistId) : undefined;

  return (
    <ContactPageClient
      artworkId={Number.isFinite(artworkId) ? artworkId : undefined}
      artistId={Number.isFinite(artistId) ? artistId : undefined}
    />
  );
}
