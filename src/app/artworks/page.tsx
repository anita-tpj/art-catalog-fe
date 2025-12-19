import type { Metadata } from "next";
import { ArtworksPageClient } from "./artworks-page-client";
import { ALL_CATEGORIES_VALUE } from "@/services/artwork-category-options";

function toPositiveInt(v: string | undefined, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function humanizeEnum(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/(^\w)|(\s\w)/g, (m) => m.toUpperCase());
}

export function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}): Metadata {
  const category = searchParams.category;
  const search = searchParams.search;

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

export default function ArtworksPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const initialSearch = searchParams.search ?? "";
  const initialCategory = searchParams.category ?? ALL_CATEGORIES_VALUE;
  const initialPage = toPositiveInt(searchParams.page, 1);
  const initialPageSize = toPositiveInt(searchParams.pageSize, 5);

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
