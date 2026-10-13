import { getTermsTranslation } from "@/i18n/server";
import { URLS } from "@/lib/config";
import type { Metadata } from "next";
import { TermsPageClient } from "./terms-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTermsTranslation();

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${URLS.artCatalog}/terms`,
    },
  };
}

export default function TermsPage() {
  return <TermsPageClient />;
}