import { ALL_CATEGORIES_VALUE } from "@/features/listing/services/artwork-category-options";
import { getTranslation } from "@/i18n/server";
import { URLS } from "@/lib/config";
import { humanizeEnum, toPositiveInt } from "@/lib/utils";
import type { Metadata } from "next";
import { ArtistsPageClient } from "./artists-page-client";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const { t } = await getTranslation();

  const primaryCategory = sp.primaryCategory;
  const search = sp.search;

  const parts = [t("Artists")];

  if (primaryCategory) parts.push(humanizeEnum(primaryCategory));
  if (search) parts.push(`${t("Search")}: ${search}`);

  const title = parts.join(" – ");

  return {
    title: `${title} | ArtCatalog`,
    description: t(
      "Discover artists featured in ArtCatalog and explore their work across categories and styles.",
    ),
    alternates: {
      canonical: `${URLS.artCatalog}/artists`,
    },
  };
}

export default async function ArtistsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const initialSearch = sp.search ?? "";
  const initialCategory = sp.primaryCategory ?? ALL_CATEGORIES_VALUE;
  const initialPage = toPositiveInt(sp.page, 1);
  const initialPageSize = toPositiveInt(sp.pageSize, 6);

  return (
    <ArtistsPageClient
      initialSearch={initialSearch}
      initialCategory={initialCategory}
      initialPage={initialPage}
      initialPageSize={initialPageSize}
    />
  );
}
