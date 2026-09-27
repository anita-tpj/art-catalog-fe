// app/artworks/page.tsx
import { ALL_CATEGORIES_VALUE } from "@/features/listing/services/artwork-category-options";
import { humanizeEnum, toPositiveInt } from "@/lib/utils";
import type { Metadata } from "next";
import { ArtworksPageClient } from "./artworks-page-client";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const category = sp.category;
  const search = sp.search;

  const parts = ["Artworks"];

  if (category) parts.push(humanizeEnum(category));
  if (search) parts.push(`Search: ${search}`);

  const title = parts.join(" – ");

  return {
    title: `${title} | ArtCatalog`,
    description:
      "Explore artworks across styles and categories. Discover new pieces and contemporary visual work.",
    alternates: {
      canonical: "/artworks",
    },
  };
}

export default async function ArtworksPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const initialSearch = sp.search ?? "";
  const initialCategory = sp.category ?? ALL_CATEGORIES_VALUE;
  const initialPage = toPositiveInt(sp.page, 1);
  const initialPageSize = toPositiveInt(sp.pageSize, 6);
  const initialArtist = sp.artist?.trim() || undefined;

  return (
    <ArtworksPageClient
      initialSearch={initialSearch}
      initialCategory={initialCategory}
      initialPage={initialPage}
      initialPageSize={initialPageSize}
      initialArtist={initialArtist}
    />
  );
}
