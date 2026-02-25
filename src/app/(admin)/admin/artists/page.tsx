"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui";
import { EmptyState } from "@/components/ui";
import { PageSizeSelector } from "@/components/ui";
import { Pagination } from "@/components/ui";

import { FiEdit } from "react-icons/fi";
import { MdOutlineAdd } from "react-icons/md";
import { TbTrashX } from "react-icons/tb";

import { SearchEmptyState } from "@/components/ui";
import { SearchInput } from "@/components/ui";
import { AdminResponsiveList } from "@/features/admin";
import { useRemoveArtist } from "@/features/artists/hooks/useRemoveArtist";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePaginationState } from "@/hooks/usePaginationState";
import { usePaginatedArtists } from "@/features/artists/hooks/useArtists";

export default function AdminArtistsPage() {
  const { page, pageSize, changePage, changePageSize } = usePaginationState(10);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, error, isError, isLoading } = usePaginatedArtists({
    page,
    pageSize,
    search: debouncedSearch || undefined,
  });

  const removeArtist = useRemoveArtist();

  // Reset page when search changes
  useEffect(() => {
    changePage(1);
  }, [debouncedSearch, changePage]);

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
          <h1 className="text-xl font-semibold tracking-tight">Artists</h1>

          <Button asChild>
            <Link href="/admin/artists/new">
              <div className="flex items-center gap-1">
                <MdOutlineAdd size={22} />
                <span>New Artist</span>
              </div>
            </Link>
          </Button>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search artists..."
        />
      </header>

      {/* ===== MAIN CONTENT SWITCH ===== */}
      {isLoading ? (
        <Card className="p-4 text-sm text-zinc-500">Loading artists…</Card>
      ) : isEmptyDb ? (
        <EmptyState
          message="No artists yet."
          actionHref="/admin/artists/new"
          actionLabel="Create Artist"
        />
      ) : isSearchEmpty ? (
        <SearchEmptyState query={debouncedSearch} entityLabel="artists" />
      ) : (
        <>
          {/* ===== Responsive table/cards ===== */}
          <AdminResponsiveList
            items={items}
            isLoading={isLoading}
            loadingContent={
              <Card className="p-4 text-sm text-zinc-500">
                Loading artists…
              </Card>
            }
            renderTable={(items) => (
              <Card className="p-0">
                <table className="w-full border-t border-zinc-200 text-sm dark:border-zinc-800">
                  <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                    <tr>
                      <th className="px-4 py-2">Artist</th>
                      <th className="px-4 py-2">Country</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((artist) => (
                      <tr
                        key={artist.id}
                        className="border-t border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                      >
                        {/* Avatar + name */}
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
                              {artist.avatarUrl ? (
                                <Image
                                  src={artist.avatarUrl}
                                  alt={artist.name}
                                  width={32}
                                  height={32}
                                  className="h-8 w-8 object-cover"
                                />
                              ) : (
                                <span className="text-[10px] text-zinc-400">
                                  NA
                                </span>
                              )}
                            </div>
                            <span className="font-medium">{artist.name}</span>
                          </div>
                        </td>

                        {/* Country */}
                        <td className="px-4 py-2">
                          {artist.country || (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-end gap-3">
                            <Link href={`/admin/artists/${artist.id}/edit`}>
                              <FiEdit
                                size={18}
                                className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                              />
                            </Link>

                            <ConfirmDialog
                              title="Delete artist"
                              description="This action cannot be undone. This will permanently delete the artist."
                              onConfirm={() => removeArtist.mutate(artist.id)}
                              isLoading={removeArtist.isPending}
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
                {items.map((artist) => (
                  <Card key={artist.id} className="p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      {/* Avatar + name + country */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
                          {artist.avatarUrl ? (
                            <Image
                              src={artist.avatarUrl}
                              alt={artist.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-zinc-400">
                              NA
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{artist.name}</div>
                          <div className="text-xs text-zinc-500">
                            {artist.country || "Unknown country"}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/artists/${artist.id}/edit`}>
                          <FiEdit
                            size={18}
                            className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                          />
                        </Link>

                        <ConfirmDialog
                          title="Delete artist"
                          description="This action cannot be undone. This will permanently delete the artist."
                          onConfirm={() => removeArtist.mutate(artist.id)}
                          isLoading={removeArtist.isPending}
                        >
                          <TbTrashX
                            size={21}
                            className="cursor-pointer text-red-600 hover:text-red-700"
                          />
                        </ConfirmDialog>
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
