import { ArtistProfile } from "@/features/artists/components/ArtistProfile";
import { Artist } from "@/features/artists/types";
import { get } from "@/lib/api-client";
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

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  try {
    const artist = await getArtistBySlug(slug);

    const title = `${artist.name} — Artist | ArtCatalog`;
    const description = artist.bio ?? `Explore artworks by ${artist.name}.`;

    return {
      title,
      description,
      alternates: {
        canonical: `/${artist.slug}`,
      },
      openGraph: {
        title,
        description,
      },
    };
  } catch {
    return {
      title: "Artist not found",
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
