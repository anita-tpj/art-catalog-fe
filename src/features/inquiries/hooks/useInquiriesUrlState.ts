"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePaginationState } from "@/hooks/usePaginationState";
import { InboxStatus, InquiryStatus } from "../types";

function isInquiryStatus(v: string): v is InquiryStatus {
  return v === "NEW" || v === "READ" || v === "ARCHIVED" || v === "ALL";
}

type Args = {
  initialSearch: string;
  initialStatus: string;
  initialPage: number;
  initialPageSize: number;
  defaultPageSize?: number;
};

export function useInquiriesUrlState({
  initialSearch,
  initialStatus,
  initialPage,
  initialPageSize,
  defaultPageSize = 20,
}: Args) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const { page, pageSize, changePage, changePageSize } = usePaginationState({
    page: initialPage,
    pageSize: initialPageSize,
  });

  const [status, setStatus] = useState<InboxStatus>(
    isInquiryStatus(initialStatus) ? initialStatus : "ALL",
  );

  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebouncedValue(search, 400);
  const prevDebouncedSearch = useRef(debouncedSearch);

  const buildUrl = useCallback(
    (
      next: Partial<{
        search: string;
        status: InboxStatus;
        page: number;
        pageSize: number;
      }>,
    ) => {
      const params = new URLSearchParams();

      const nextSearch = (next.search ?? debouncedSearch ?? "").trim();
      const nextStatus = next.status ?? status;
      const nextPage = next.page ?? page;
      const nextPageSize = next.pageSize ?? pageSize;

      const isDefault =
        !nextSearch &&
        nextStatus === "ALL" &&
        nextPage === 1 &&
        nextPageSize === defaultPageSize;

      if (isDefault) return pathname;

      if (nextSearch) params.set("search", nextSearch);
      if (nextStatus && nextStatus !== "ALL") params.set("status", nextStatus);

      params.set("page", String(nextPage));
      params.set("pageSize", String(nextPageSize));

      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [debouncedSearch, status, page, pageSize, pathname, defaultPageSize],
  );

  const onStatusChange = (v: InboxStatus) => {
    setStatus(v);
    changePage(1);
    router.push(buildUrl({ status: v, page: 1 }));
  };

  const onClearSearch = () => {
    setSearch("");
    changePage(1);
    router.push(buildUrl({ search: "", page: 1 }));
  };

  const onClearFilters = () => {
    setSearch("");
    setStatus("ALL");
    changePageSize(defaultPageSize); // resets page to 1
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

  // Search -> reset page + replace URL (guarded)
  useEffect(() => {
    const searchChanged = prevDebouncedSearch.current !== debouncedSearch;
    prevDebouncedSearch.current = debouncedSearch;

    if (!searchChanged) return;

    if (page !== 1) changePage(1);

    const nextUrl = buildUrl({ search: debouncedSearch, page: 1 });
    const currentQs = sp.toString();
    const currentUrl = currentQs ? `${pathname}?${currentQs}` : pathname;

    if (nextUrl !== currentUrl) router.replace(nextUrl);
  }, [debouncedSearch, page, changePage, router, buildUrl, sp, pathname]);

  const apiStatus: InquiryStatus | undefined =
    status === "ALL" ? undefined : (status as InquiryStatus);

  return {
    // state
    search,
    setSearch,
    debouncedSearch,
    status,
    apiStatus,

    // table
    page,
    pageSize,

    // handlers
    onStatusChange,
    onClearSearch,
    onClearFilters,
    onPageChange,
    onPageSizeChange,

    // for callers
    defaultPageSize,
    pathname,
  };
}
