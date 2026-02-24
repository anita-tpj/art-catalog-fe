import {
  ArtworkCategory,
  ArtworkCategoryLabels,
} from "@/features/artworks/types";

export const ALL_CATEGORIES_VALUE = "ALL";

export type SelectOption = {
  value: string;
  label: string;
};

export const artworkCategoryOptions: SelectOption[] = [
  { value: ALL_CATEGORIES_VALUE, label: "All categories" },
  ...Object.values(ArtworkCategory)
    .sort((a, b) =>
      ArtworkCategoryLabels[a].localeCompare(ArtworkCategoryLabels[b]),
    )
    .map((value) => ({
      value,
      label: ArtworkCategoryLabels[value],
    })),
];
