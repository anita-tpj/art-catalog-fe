import { URLS } from "@/config/urls";
import { ArtistProfile } from "@/features/artists/components/ArtistProfile";
import { Artist } from "@/features/artists/types";
import { getTranslation } from "@/i18n/server";
import { get } from "@/lib/api-client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 0;

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getArtistBySlug(slug: string) {
  return get<Artist>(
    `/api/artists/public/profile/${encodeURIComponent(slug)}`,
    { revalidate },
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { t } = await getTranslation();

  try {
    const artist = await getArtistBySlug(slug);

    const title = `${artist.name} — ${t("Artist")} | ArtCatalog`;

    const description =
      artist.bio?.trim() ||
      t("Explore artworks by {{name}}.").replace("{{name}}", artist.name);

    const canonical = `${URLS.creativeAtlas}/${artist.slug}`;

    const isPublic =
      artist.status === "PUBLISHED" && artist.visibility === "PUBLIC";

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
      },
      robots: {
        index: isPublic,
        follow: isPublic,
      },
    };
  } catch {
    return {
      title: t("Artist not found"),
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function ArtistSlugPage({ params }: PageProps) {
  const { slug } = await params;

  let artist: Artist;

  try {
    artist = await getArtistBySlug(slug);
  } catch {
    notFound();
  }

  return <ArtistProfile artist={artist} />;
}
