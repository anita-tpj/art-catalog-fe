"use client";

import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui";
import { EmptyState } from "@/components/ui";
import { PageSizeSelector } from "@/components/ui";
import { Pagination } from "@/components/ui";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FiEdit } from "react-icons/fi";
import { MdOutlineAdd } from "react-icons/md";
import { TbTrashX } from "react-icons/tb";

import { SearchEmptyState } from "@/components/ui";
import { SearchInput } from "@/components/ui";
import { AdminResponsiveList } from "@/features/admin";
import { useRemoveArtwork } from "@/features/artworks/hooks/useRemoveArtwork";
import { usePaginatedArtworks } from "@/features/artworks/hooks/useArtworks";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePaginationState } from "@/hooks/usePaginationState";

export default function AdminArtworksPage() {
  const { page, pageSize, changePage, changePageSize } = usePaginationState(10);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading, isError, error } = usePaginatedArtworks({
    page,
    pageSize,
    search: debouncedSearch || undefined,
  });

  // Reset page on search change
  useEffect(() => {
    changePage(1);
  }, [debouncedSearch, changePage]);

  const removeArtwork = useRemoveArtwork();

  if (isError && error) throw error;

  // Extract data
  const items = data?.items ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data ? Math.ceil(total / data.meta.pageSize) : 0;

  // State logic
  const isEmptyDb =
    !isLoading &&
    items.length === 0 &&
    (!debouncedSearch || debouncedSearch.trim() === "");

  const isSearchEmpty =
    !isLoading &&
    items.length === 0 &&
    debouncedSearch &&
    debouncedSearch.trim() !== "";

  return (
    <section className="space-y-4">
      {/* ===== HEADER (always visible) ===== */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-tight">Artworks</h1>

          <Button asChild>
            <Link href="/admin/artworks/new">
              <div className="flex items-center gap-1">
                <MdOutlineAdd size={22} />
                <span>New Artwork</span>
              </div>
            </Link>
          </Button>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search artworks..."
        />
      </header>

      {/* ===== MAIN CONTENT SWITCH ===== */}
      {isLoading ? (
        <Card className="p-4 text-sm text-zinc-500">Loading artworks…</Card>
      ) : isEmptyDb ? (
        <EmptyState
          message="No artworks yet."
          actionHref="/admin/artworks/new"
          actionLabel="Create Artwork"
        />
      ) : isSearchEmpty ? (
        <SearchEmptyState query={debouncedSearch} entityLabel="artworks" />
      ) : (
        <>
          {/* ===== Responsive table/cards ===== */}
          <AdminResponsiveList
            items={items}
            isLoading={isLoading}
            loadingContent={
              <Card className="p-4 text-sm text-zinc-500">
                Loading artworks…
              </Card>
            }
            renderTable={(items) => (
              <Card className="p-0">
                <table className="w-full border-t border-zinc-200 text-sm dark:border-zinc-800">
                  <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                    <tr>
                      <th className="px-4 py-2 w-20">Image</th>
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">Artist</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((artwork) => (
                      <tr
                        key={artwork.id}
                        className="border-t border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                      >
                        {/* Thumbnail */}
                        <td className="px-4 py-2">
                          <div className="h-12 w-12 overflow-hidden rounded border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 flex items-center justify-center">
                            {artwork.imageUrl ? (
                              <Image
                                src={artwork.imageUrl}
                                alt={artwork.title}
                                width={80}
                                height={80}
                                className="h-12 w-auto object-contain"
                              />
                            ) : (
                              <span className="text-[10px] text-zinc-400">
                                No image
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Title */}
                        <td className="px-4 py-2">{artwork.title}</td>

                        {/* Artist */}
                        <td className="px-4 py-2">{artwork.artist.name}</td>

                        {/* Actions */}
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-end gap-3">
                            <Link href={`/admin/artworks/${artwork.id}/edit`}>
                              <FiEdit
                                size={18}
                                className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                              />
                            </Link>

                            <ConfirmDialog
                              title="Delete artwork"
                              description="This action cannot be undone. This will permanently delete the artwork."
                              onConfirm={() => removeArtwork.mutate(artwork.id)}
                              isLoading={removeArtwork.isPending}
                            >
                              <TbTrashX
                                size={21}
                                className="cursor-pointer text-red-600 hover:text-red-700"
                              />
                            </ConfirmDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
            renderCards={(items) => (
              <>
                {items.map((artwork) => (
                  <Card
                    key={artwork.id}
                    className="flex flex-col gap-2 p-3 text-sm"
                  >
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 flex items-center justify-center">
                        {artwork.imageUrl ? (
                          <Image
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            width={100}
                            height={100}
                            className="h-16 w-auto object-contain"
                          />
                        ) : (
                          <span className="text-[10px] text-zinc-400">
                            No image
                          </span>
                        )}
                      </div>

                      {/* Text + actions */}
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-medium">{artwork.title}</div>
                            <div className="text-xs text-zinc-500">
                              {artwork.artist.name}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link href={`/admin/artworks/${artwork.id}/edit`}>
                              <FiEdit
                                size={18}
                                className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                              />
                            </Link>

                            <ConfirmDialog
                              title="Delete artwork"
                              description="This action cannot be undone. This will permanently delete the artwork."
                              onConfirm={() => removeArtwork.mutate(artwork.id)}
                              isLoading={removeArtwork.isPending}
                            >
                              <TbTrashX
                                size={21}
                                className="cursor-pointer text-red-600 hover:text-red-700"
                              />
                            </ConfirmDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
          />

          {/* ===== Pagination ===== */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 pt-4 text-xs">
              <PageSizeSelector
                value={pageSize}
                onChange={changePageSize}
                options={[5, 10, 20, 50]}
              />

              <Pagination
                page={data?.meta.page ?? page}
                totalPages={totalPages}
                onPageChange={changePage}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
