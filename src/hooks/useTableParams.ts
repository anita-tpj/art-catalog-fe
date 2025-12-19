"use client";

import { useCallback, useState } from "react";
type Init = number | { page?: number; pageSize?: number };

export function useTableParams(init: Init = 10) {
  const initialPageSize = typeof init === "number" ? init : init.pageSize ?? 10;
  const initialPage = typeof init === "number" ? 1 : init.page ?? 1;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const changePage = useCallback((p: number) => setPage(p), []);
  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  return { page, pageSize, changePage, changePageSize };
}

