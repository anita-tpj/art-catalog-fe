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
      .sort((a, b) => {
        if (a === ArtworkCategory.OTHER) return 1;
        if (b === ArtworkCategory.OTHER) return -1;

        return t(ArtworkCategoryLabels[a]).localeCompare(
          t(ArtworkCategoryLabels[b]),
          undefined,
          { sensitivity: "base" },
        );
      })
      .map((value) => ({
        value,
        label: t(ArtworkCategoryLabels[value]),
      })),
  ];
}
