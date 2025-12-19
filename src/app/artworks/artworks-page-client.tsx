"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ArtworkCard } from "@/components/artworks/ArtworkCard";
import { ArtworkCardSkeleton } from "@/components/artworks/ArtworkCardSkeleton";
import { ErrorState } from "@/components/ui/error-state";
import { PageSizeSelector } from "@/components/ui/page-size-selector";
import { Pagination } from "@/components/ui/pagination";

import { useDebouncedValue } from "@/hooks/artists/useDebouncedValue";
import { usePaginatedArtworks } from "@/hooks/artworks/useArtworks";
import { useTableParams } from "@/hooks/useTableParams";

import { ALL_CATEGORIES_VALUE } from "@/services/artwork-category-options";
import { ArtworksToolbar } from "@/components/artworks/ArtworksToolbar";

function toPositiveInt(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

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

  // ✅ keep this in sync with your server default / page.tsx default
  const DEFAULT_PAGE_SIZE = 5;

  const { page, pageSize, changePage, changePageSize } = useTableParams({
    page: initialPage,
    pageSize: initialPageSize,
  });

  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebouncedValue(search, 400);
  const prevDebouncedSearch = useRef(debouncedSearch);

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

  // Build URL from CURRENT STATE (avoids loops)
  const buildUrl = useCallback(
    (
      next: Partial<{
        search: string;
        category: string;
        page: number;
        pageSize: number;
      }>
    ) => {
      const params = new URLSearchParams();

      const nextSearch = (next.search ?? debouncedSearch ?? "").trim();
      const nextCategory = next.category ?? category;
      const nextPage = next.page ?? page;
      const nextPageSize = next.pageSize ?? pageSize;

      // ✅ if everything is default, keep URL clean
      const isDefault =
        !nextSearch &&
        nextCategory === ALL_CATEGORIES_VALUE &&
        nextPage === 1 &&
        nextPageSize === DEFAULT_PAGE_SIZE;

      if (isDefault) return pathname;

      if (nextSearch) params.set("search", nextSearch);
      if (nextCategory && nextCategory !== ALL_CATEGORIES_VALUE) {
        params.set("category", nextCategory);
      }

      // keep paging params only when not default
      params.set("page", String(nextPage));
      params.set("pageSize", String(nextPageSize));

      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [debouncedSearch, category, page, pageSize, pathname, DEFAULT_PAGE_SIZE]
  );

  // Handlers (push URL for deliberate user actions)
  const onCategoryChange = (v: string) => {
    setCategory(v);
    changePage(1);
    router.push(buildUrl({ category: v, page: 1 }));
  };

  const onClearSearch = () => {
    setSearch("");
    changePage(1);
    router.push(buildUrl({ search: "", page: 1 }));
  };

  const onClearCategory = () => {
    setCategory(ALL_CATEGORIES_VALUE);
    changePage(1);
    router.push(buildUrl({ category: ALL_CATEGORIES_VALUE, page: 1 }));
  };

  const onClearFilters = () => {
    setSearch("");
    setCategory(ALL_CATEGORIES_VALUE);

    // reset paging to defaults
    changePageSize(DEFAULT_PAGE_SIZE); // sets page=1 too

    // Go to clean URL
    router.push(pathname);
  };

  const onPageChange = (p: number) => {
    changePage(p);
    router.push(buildUrl({ page: p }));
  };

  const onPageSizeChange = (s: number) => {
    changePageSize(s); // resets page to 1
    router.push(buildUrl({ pageSize: s, page: 1 }));
  };

  // Search → reset page + replace URL (guarded)
useEffect(() => {
  const searchChanged = prevDebouncedSearch.current !== debouncedSearch;
  prevDebouncedSearch.current = debouncedSearch;

  if (!searchChanged) return; // ✅ don't run on pagination changes

  // reset page on search change
  if (page !== 1) changePage(1);

  const nextUrl = buildUrl({ search: debouncedSearch, page: 1 });
  const currentQs = sp.toString();
  const currentUrl = currentQs ? `${pathname}?${currentQs}` : pathname;

  if (nextUrl !== currentUrl) router.replace(nextUrl);
}, [debouncedSearch, page, changePage, router, buildUrl, sp, pathname]);

  return (
    <>
      <div className="mb-2 space-y-2">
        <h1 className="text-3xl font-semibold">Artworks</h1>
        <p className="text-sm text-muted-foreground">
          Browse the gallery. Use search + category to filter.
        </p>
      </div>

      <ArtworksToolbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={onCategoryChange}
        onClearFilters={onClearFilters}
        onClearSearch={onClearSearch}
        onClearCategory={onClearCategory}
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
              onChange={onPageSizeChange}
              options={[5, 10, 20, 50]}
            />

            <Pagination
              page={data?.meta.page ?? page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </>
  );
}
