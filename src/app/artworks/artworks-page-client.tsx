"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { ErrorState } from "@/components/ui";
import { PageSizeSelector } from "@/components/ui";
import { Pagination } from "@/components/ui";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePaginationState } from "@/hooks/usePaginationState";

import {
  ArtworkCard,
  ArtworkCardSkeleton,
  usePaginatedArtworks,
} from "@/features/artworks";
import { ListingToolbar } from "@/features/listing/components/ListingToolbar";
import { useListingUrlState } from "@/features/listing/hooks/useListingUrlState";
import { ALL_CATEGORIES_VALUE } from "@/features/listing/services/artwork-category-options";

type Props = {
  initialSearch: string;
  initialCategory: string;
  initialPage: number;
  initialPageSize: number;
};

export function ArtworksPageClient({
  initialSearch,
  initialCategory,
  initialPage,
  initialPageSize,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const DEFAULT_PAGE_SIZE = 6;

  const { page, pageSize, changePage, changePageSize } = usePaginationState({
    page: initialPage,
    pageSize: initialPageSize,
  });

  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebouncedValue(search, 400);

  const apiCategory = category === ALL_CATEGORIES_VALUE ? undefined : category;

  const { data, isLoading, isError, error, refetch } = usePaginatedArtworks({
    page,
    pageSize,
    search: debouncedSearch || undefined,
    category: apiCategory,
  });

  const items = data?.items ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data ? Math.ceil(total / data.meta.pageSize) : 0;

  const listing = useListingUrlState({
    router,
    pathname,
    searchParamsString: sp.toString(),
    debouncedSearch,
    category,
    page,
    pageSize,
    setSearch,
    setCategory,
    changePage,
    changePageSize,
    defaultPageSize: DEFAULT_PAGE_SIZE,
    allCategoriesValue: ALL_CATEGORIES_VALUE,
    keys: { categoryKey: "category" },
  });

  return (
    <>
      <div className="mb-2 space-y-2">
        <h1 className="text-3xl font-semibold">Artworks</h1>
        <p className="text-sm text-muted-foreground">
          Browse the gallery. Use search + category to filter.
        </p>
      </div>

      <ListingToolbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={listing.onCategoryChange}
        onClearFilters={listing.onClearFilters}
        onClearSearch={listing.onClearSearch}
        onClearCategory={listing.onClearCategory}
      />

      {isLoading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: pageSize }).map((_, i) => (
            <ArtworkCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Couldn’t load artworks"
          message={error instanceof Error ? error.message : "Please try again."}
          onRetry={() => refetch()}
        />
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-lg border p-8 text-center text-sm text-muted-foreground">
          No artworks found.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}

      <div className="mt-8">
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 pt-4 text-xs">
            <PageSizeSelector
              value={pageSize}
              onChange={listing.onPageSizeChange}
              options={[6, 12, 24, 48, 96]}
            />

            <Pagination
              page={data?.meta.page ?? page}
              totalPages={totalPages}
              onPageChange={listing.onPageChange}
            />
          </div>
        )}
      </div>
    </>
  );
}
