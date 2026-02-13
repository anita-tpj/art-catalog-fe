// app/artists/page.tsx
import { ALL_CATEGORIES_VALUE } from "@/services/artwork-category-options";
import { ArtistsPageClient } from "./artists-page-client";
import { humanizeEnum, toPositiveInt } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps) {
  const sp = await searchParams;
  const primaryCategory = sp.primaryCategory;
  const search = sp.search;

  const parts = ["Artists"];

  if (primaryCategory) parts.push(humanizeEnum(primaryCategory));
  if (search) parts.push(`Search: ${search}`);

  const title = parts.join(" – ");

  return {
    title,
    description: "Browse artists by primary category.",
    alternates: {
      canonical: "/artists",
    },
  };
}

export default async function ArtistsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const initialSearch = sp.search ?? "";
  const initialCategory = sp.primaryCategory ?? ALL_CATEGORIES_VALUE;
  const initialPage = toPositiveInt(sp.page, 1);
  const initialPageSize = toPositiveInt(sp.pageSize, 12);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <ArtistsPageClient
        initialSearch={initialSearch}
        initialCategory={initialCategory}
        initialPage={initialPage}
        initialPageSize={initialPageSize}
      />
    </main>
  );
}
