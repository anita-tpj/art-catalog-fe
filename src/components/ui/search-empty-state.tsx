"use client";

import { useTranslation } from "react-i18next";

interface SearchEmptyStateProps {
  query: string;
  entityLabel?: string;
}

export function SearchEmptyState({
  query,
  entityLabel = "items",
}: SearchEmptyStateProps) {
  const { t } = useTranslation();

  if (!query.trim()) return null;

  return (
    <div className="rounded-md border border-zinc-200 p-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
      {t("No")} {entityLabel} {t("match")} “{query}”.
    </div>
  );
}
