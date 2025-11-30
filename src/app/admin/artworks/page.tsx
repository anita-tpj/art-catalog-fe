"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useArtworks } from "@/hooks/artworks/useArtworks";
import { useRemoveArtwork } from "@/hooks/artworks/useRemoveArtwork";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { TbTrashX } from "react-icons/tb";
import { FiEdit } from "react-icons/fi";
import { MdOutlineAdd } from "react-icons/md";
import { ResponsiveList } from "@/components/admin/ResponsiveList";
import { Pagination } from "@/components/ui/pagination";
import { useTableParams } from "@/hooks/useTableParams";
import { PageSizeSelector } from "@/components/ui/page-size-selector";

export default function AdminArtworksPage() {
  const { page, pageSize, changePage, changePageSize } = useTableParams(10);
  const { data, isLoading, isError, error } = useArtworks(page, pageSize);
  const removeArtwork = useRemoveArtwork();

  // Throw to global error boundary
  if (isError && error) {
    throw error;
  }

  const items = data?.items ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data ? Math.ceil(total / data.meta.pageSize) : 0;

  // Empty state
  if (!items.length && !isLoading) {
    return (
      <EmptyState
        message="No artworks yet."
        actionHref="/admin/artworks/new"
        actionLabel="Create Artwork"
      />
    );
  }

  //Add: category, artist name, work thumbnail

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Artworks</h1>
        </div>

        <Button asChild>
          <Link href="/admin/artworks/new">
            <div className="flex items-center gap-1">
              <MdOutlineAdd size={22} />
              <span>New Artwork</span>
            </div>
          </Link>
        </Button>
      </header>

      <ResponsiveList
        items={items}
        isLoading={isLoading}
        loadingContent={
          <Card className="p-4 text-sm text-zinc-500">Loading artworks…</Card>
        }
        renderTable={(items) => (
          <Card className="p-0">
            <table className="w-full border-t border-zinc-200 text-sm dark:border-zinc-800">
              <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Year</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((artwork) => (
                  <tr
                    key={artwork.id}
                    className="border-t border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    <td className="px-4 py-2">{artwork.title}</td>
                    <td className="px-4 py-2">
                      {artwork.year ?? <span className="text-zinc-400">—</span>}
                    </td>
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
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{artwork.title}</div>
                    <div className="text-xs text-zinc-500">
                      {artwork.year ?? "Year unknown"}
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
              </Card>
            ))}
          </>
        )}
      />
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-4 text-xs">
          <PageSizeSelector
            value={pageSize}
            onChange={changePageSize}
            options={[10, 20, 30, 50]}
          />

          <Pagination
            page={data?.meta.page ?? page}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </div>
      )}
    </section>
  );
}
