import { getPrivacyTranslation } from "@/i18n/server";
import { URLS } from "@/lib/config";
import type { Metadata } from "next";
import { PrivacyPageClient } from "./privacy-page-client";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getPrivacyTranslation();

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${URLS.artCatalog}/privacy`,
    },
  };
}

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}