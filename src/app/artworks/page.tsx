import type { Metadata } from "next";
import { ArtworksPageClient } from "./artworks-page-client";
import { ALL_CATEGORIES_VALUE } from "@/services/artwork-category-options";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

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
  const initialPageSize = toPositiveInt(sp.pageSize, 5);

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
