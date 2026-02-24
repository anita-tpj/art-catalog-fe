// src/features/listing/hooks/useListingUrlState.ts
"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useCallback, useEffect, useRef } from "react";

type BuildUrlKeys = {
  searchKey?: string; // default "search"
  categoryKey: string; // "category" | "primaryCategory" | etc
  pageKey?: string; // default "page"
  pageSizeKey?: string; // default "pageSize"
};

type Params = {
  router: AppRouterInstance;
  pathname: string;
  searchParamsString: string; // pass sp.toString() from useSearchParams()
  // current state
  debouncedSearch: string;
  category: string;
  page: number;
  pageSize: number;

  // setters / table actions
  setSearch: (v: string) => void;
  setCategory: (v: string) => void;
  changePage: (p: number) => void;
  changePageSize: (s: number) => void;

  // constants
  defaultPageSize: number;
  allCategoriesValue: string;

  // config
  keys: BuildUrlKeys;
};

export function useListingUrlState({
  router,
  pathname,
  searchParamsString,
  debouncedSearch,
  category,
  page,
  pageSize,
  setSearch,
  setCategory,
  changePage,
  changePageSize,
  defaultPageSize,
  allCategoriesValue,
  keys,
}: Params) {
  const {
    searchKey = "search",
    categoryKey,
    pageKey = "page",
    pageSizeKey = "pageSize",
  } = keys;

  const prevDebouncedSearch = useRef(debouncedSearch);

  const buildUrl = useCallback(
    (
      next: Partial<{
        search: string;
        category: string;
        page: number;
        pageSize: number;
      }>,
    ) => {
      const params = new URLSearchParams();

      const nextSearch = (next.search ?? debouncedSearch ?? "").trim();
      const nextCategory = next.category ?? category;
      const nextPage = next.page ?? page;
      const nextPageSize = next.pageSize ?? pageSize;

      const isDefault =
        !nextSearch &&
        nextCategory === allCategoriesValue &&
        nextPage === 1 &&
        nextPageSize === defaultPageSize;

      if (isDefault) return pathname;

      if (nextSearch) params.set(searchKey, nextSearch);

      if (nextCategory && nextCategory !== allCategoriesValue) {
        params.set(categoryKey, nextCategory);
      }

      params.set(pageKey, String(nextPage));
      params.set(pageSizeKey, String(nextPageSize));

      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [
      debouncedSearch,
      category,
      page,
      pageSize,
      pathname,
      defaultPageSize,
      allCategoriesValue,
      searchKey,
      categoryKey,
      pageKey,
      pageSizeKey,
    ],
  );

  const onCategoryChange = (v: string) => {
    setCategory(v);
    changePage(1);
    router.push(buildUrl({ category: v, page: 1 }));
  };

  const onClearCategory = () => {
    setCategory(allCategoriesValue);
    changePage(1);
    router.push(buildUrl({ category: allCategoriesValue, page: 1 }));
  };

  const onClearSearch = () => {
    setSearch("");
    changePage(1);
    router.push(buildUrl({ search: "", page: 1 }));
  };

  const onClearFilters = () => {
    setSearch("");
    setCategory(allCategoriesValue);
    changePageSize(defaultPageSize); // implies page=1 in your usePaginationState
    router.push(pathname); // clean URL
  };

  const onPageChange = (p: number) => {
    changePage(p);
    router.push(buildUrl({ page: p }));
  };

  const onPageSizeChange = (s: number) => {
    changePageSize(s); // resets page to 1
    router.push(buildUrl({ pageSize: s, page: 1 }));
  };

  // debounced search -> reset page + replace URL (guarded)
  useEffect(() => {
    const searchChanged = prevDebouncedSearch.current !== debouncedSearch;
    prevDebouncedSearch.current = debouncedSearch;

    if (!searchChanged) return;

    if (page !== 1) changePage(1);

    const nextUrl = buildUrl({ search: debouncedSearch, page: 1 });
    const currentUrl = searchParamsString
      ? `${pathname}?${searchParamsString}`
      : pathname;

    if (nextUrl !== currentUrl) router.replace(nextUrl);
  }, [
    debouncedSearch,
    page,
    changePage,
    router,
    buildUrl,
    pathname,
    searchParamsString,
  ]);

  return {
    buildUrl,
    onCategoryChange,
    onClearCategory,
    onClearSearch,
    onClearFilters,
    onPageChange,
    onPageSizeChange,
  };
}
