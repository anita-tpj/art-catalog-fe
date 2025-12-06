"use client";

import { useState } from "react";

export function useTableParams(defaultPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const changePage = (p: number) => setPage(p);

  const changePageSize = (size: number) => {
    setPageSize(size);
    setPage(1); // reset page when page size changes
  };

  return {
    page,
    pageSize,
    changePage,
    changePageSize,
  };
}
