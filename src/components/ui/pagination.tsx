"use client";

import { Button } from "@/components/ui";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  TriangleLeftIcon,
  TriangleRightIcon,
} from "@radix-ui/react-icons";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    onPageChange(p);
  };

  // simple array 1..totalPages (za sada, kasnije možemo window (…))
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      {/* Mobile: compact mode */}
      <div className="flex items-center justify-center gap-4 text-xs md:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoPrev}
          onClick={() => goToPage(page - 1)}
        >
          <TriangleLeftIcon width={20} height={20} />
        </Button>

        <span className="whitespace-nowrap">
          {page} / {totalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoNext}
          onClick={() => goToPage(page + 1)}
        >
          <TriangleRightIcon width={20} height={20} />
        </Button>
      </div>

      {/* Desktop / tablet: full mode */}
      <div className="hidden items-center justify-center gap-1 md:flex">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoPrev}
          onClick={() => goToPage(1)}
        >
          <DoubleArrowLeftIcon />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoPrev}
          onClick={() => goToPage(page - 1)}
        >
          <ChevronLeftIcon />
        </Button>

        {pages.map((p) => (
          <Button
            key={p}
            type="button"
            size="sm"
            variant={p === page ? "primary" : "outline"}
            onClick={() => goToPage(p)}
          >
            {p}
          </Button>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoNext}
          onClick={() => goToPage(page + 1)}
        >
          <ChevronRightIcon />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoNext}
          onClick={() => goToPage(totalPages)}
        >
          <DoubleArrowRightIcon />
        </Button>
      </div>
    </>
  );
}
