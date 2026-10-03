"use client";

import { useTranslation } from "react-i18next";

export default function AboutPageClient() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("About ArtCatalog")}
      </h1>

      <p className="text-zinc-600 dark:text-zinc-300">
        {t(
          "ArtCatalog is a digital space for showcasing contemporary artists and their work. Discover artworks, explore artist profiles, and connect directly with creators.",
        )}
      </p>

      <p className="text-zinc-600 dark:text-zinc-300">
        {t(
          "Designed with simplicity and clarity in mind, ArtCatalog keeps the focus on the art and makes discovering new work effortless.",
        )}
      </p>
    </div>
  );
}
