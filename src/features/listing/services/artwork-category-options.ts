"use client";

import {
  ArtworkCategory,
  ArtworkCategoryLabels,
} from "@/features/artworks/types";
import { useTranslation } from "react-i18next";

export const ALL_CATEGORIES_VALUE = "ALL";

export type SelectOption = {
  value: string;
  label: string;
};

export function useArtworkCategoryOptions(): SelectOption[] {
  const { t } = useTranslation();

  return [
    {
      value: ALL_CATEGORIES_VALUE,
      label: t("All categories"),
    },

    ...Object.values(ArtworkCategory)
      .sort((a, b) =>
        t(ArtworkCategoryLabels[a]).localeCompare(t(ArtworkCategoryLabels[b])),
      )
      .map((value) => ({
        value,
        label: t(ArtworkCategoryLabels[value]),
      })),
  ];
}
