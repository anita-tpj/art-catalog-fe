"use client";

import Link from "next/link";

import { ErrorState } from "@/components/ui/error-state";
import { PageSizeSelector } from "@/components/ui/page-size-selector";
import { Pagination } from "@/components/ui/pagination";

import { InquiriesToolbar } from "@/features/inquiries/components/InquiriesToolbar";
import { useInquiriesUrlState } from "@/hooks/inquiries/useInquiriesUrlState";
import { usePaginatedInquiries } from "@/hooks/inquiries/useInquiries";
import { MdArrowForward, MdOutlineArchive } from "react-icons/md";
import { PiEnvelopeSimpleOpen } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { useInquiryStats } from "@/hooks/inquiries/useInquiryStats";
import { useUpdateInquiryStatus } from "@/hooks/inquiries/useUpdateStatusInquiryStatus";
import toast from "react-hot-toast";

type Props = {
  initialSearch: string;
  initialStatus: string;
  initialPage: number;
  initialPageSize: number;
};

export function InquiriesPageClient({
  initialSearch,
  initialStatus,
  initialPage,
  initialPageSize,
}: Props) {
  const DEFAULT_PAGE_SIZE = 20;

  const {
    search,
    setSearch,
    status,
    apiStatus,
    debouncedSearch,

    page,
    pageSize,

    onStatusChange,
    onClearSearch,
    onClearFilters,
    onPageChange,
    onPageSizeChange,
  } = useInquiriesUrlState({
    initialSearch,
    initialStatus,
    initialPage,
    initialPageSize,
    defaultPageSize: DEFAULT_PAGE_SIZE,
  });

  const { data, isLoading, isError, error, refetch } = usePaginatedInquiries({
    page,
    pageSize,
    search: debouncedSearch || undefined,
    status: apiStatus,
  });

  const { data: stats } = useInquiryStats();

  const items = data?.items ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data ? Math.ceil(total / data.meta.pageSize) : 0;

  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateInquiryStatus();

  const emptyMessage =
    status === "NEW"
      ? "No new inquiries."
      : status === "READ"
        ? "No read inquiries."
        : status === "ARCHIVED"
          ? "No archived inquiries."
          : "No inquiries yet.";

  return (
    <>
      <div className="mb-2 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Inquiries</h1>
            <p className="text-sm text-muted-foreground">
              Admin inbox for contact inquiries.
            </p>
          </div>
        </div>
        <InquiriesToolbar
          status={status}
          onStatusChange={onStatusChange}
          search={search}
          onSearchChange={setSearch}
          onClearSearch={onClearSearch}
          stats={stats}
        />
      </div>

      {isLoading ? (
        <div className="mt-6 rounded-2xl border p-6 text-sm text-muted-foreground">
          Loading inquiries…
        </div>
      ) : isError ? (
        <ErrorState
          title="Couldn’t load inquiries"
          message={error instanceof Error ? error.message : "Please try again."}
          onRetry={() => refetch()}
        />
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-2xl border p-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((i) => {
            const regarding = i.artwork
              ? `Artwork: ${i.artwork.title}`
              : i.artist
                ? `Artist: ${i.artist.name}`
                : i.artworkId
                  ? `Artwork ID: ${i.artworkId}`
                  : i.artistId
                    ? `Artist ID: ${i.artistId}`
                    : "—";

            const created = new Date(i.createdAt).toLocaleString();

            return (
              <div
                key={i.id}
                className={`rounded-2xl border p-4 ${
                  i.status === "NEW"
                    ? "border-primary/30 bg-primary/5 font-bold"
                    : ""
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${
                          i.status === "NEW"
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {i.status}
                      </span>

                      <span className="text-sm font-medium">{i.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {i.email}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      {regarding} • {created}
                    </div>

                    <div className="mt-3 text-sm text-muted-foreground line-clamp-3">
                      {i.message}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end items-center">
                    {i.status !== "READ" && (
                      <Button
                        variant="link"
                        disabled={isUpdating}
                        title="Mark as read"
                        onClick={() => {
                          updateStatus({ id: i.id, status: "READ" });
                          toast.success("Marked as read");
                        }}
                      >
                        <PiEnvelopeSimpleOpen size="20" />
                      </Button>
                    )}

                    {i.status !== "ARCHIVED" && (
                      <Button
                        variant="link"
                        disabled={isUpdating}
                        title="Mark as archived"
                        onClick={() => {
                          updateStatus({ id: i.id, status: "ARCHIVED" });
                          toast.success("Marked as archived");
                        }}
                      >
                        <MdOutlineArchive size="20" />
                      </Button>
                    )}

                    <Link title="Open" href={`/admin/inquiries/${i.id}`}>
                      <MdArrowForward size="20" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-6 text-xs">
          <PageSizeSelector
            value={pageSize}
            onChange={onPageSizeChange}
            options={[10, 20, 50]}
          />

          <Pagination
            page={data?.meta.page ?? page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}
