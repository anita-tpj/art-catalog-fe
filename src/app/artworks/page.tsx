// app/artworks/page.tsx
import { ArtworksPageClient } from "./artworks-page-client";
import { ALL_CATEGORIES_VALUE } from "@/services/artwork-category-options";
import { humanizeEnum, toPositiveInt } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps) {
  const sp = await searchParams;
  const category = sp.category;
  const search = sp.search;

  const parts = ["Artworks"];

  if (category) parts.push(humanizeEnum(category));
  if (search) parts.push(`Search: ${search}`);

  const title = parts.join(" – ");

  return {
    title,
    description: "Browse artworks by category and discover new pieces.",
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <ArtworksPageClient
        initialSearch={initialSearch}
        initialCategory={initialCategory}
        initialPage={initialPage}
        initialPageSize={initialPageSize}
      />
    </main>
  );
}
