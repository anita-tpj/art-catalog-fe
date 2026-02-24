"use client";

import { CategorySelect } from "@/components/ui";
import { FilterChip } from "@/components/ui";
import { SearchInput } from "@/components/ui";
import { ArtworkCategoryLabels } from "@/features/artworks/types";
import {
  ALL_CATEGORIES_VALUE,
  artworkCategoryOptions,
} from "../services/artwork-category-options";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  onClearSearch: () => void;

  category: string;
  onCategoryChange: (v: string) => void;
  onClearCategory: () => void;

  onClearFilters: () => void;
};

export function ListingToolbar({
  search,
  onSearchChange,
  onClearSearch,
  category,
  onCategoryChange,
  onClearCategory,
  onClearFilters,
}: Props) {
  const hasSearch = search.trim() !== "";
  const hasCategory = category !== ALL_CATEGORIES_VALUE;

  return (
    <section className="mt-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="md:w-[55%]">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search artworks..."
          />
        </div>

        <div className="md:w-72">
          <CategorySelect
            value={category}
            onChange={onCategoryChange}
            options={artworkCategoryOptions}
            placeholder="All categories"
          />
        </div>
      </div>

      {(hasSearch || hasCategory) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {hasSearch && (
            <FilterChip
              label={`Search: ${search.trim()}`}
              onRemove={onClearSearch}
            />
          )}

          {hasCategory && (
            <FilterChip
              label={`Category: ${
                ArtworkCategoryLabels[
                  category as keyof typeof ArtworkCategoryLabels
                ] ?? category
              }`}
              onRemove={onClearCategory}
            />
          )}

          <button
            type="button"
            onClick={onClearFilters}
            className="ml-auto text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}
    </section>
  );
}
