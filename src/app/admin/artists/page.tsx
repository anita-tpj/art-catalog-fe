"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useArtists } from "@/hooks/artists/useArtists";
import { useRemoveArtist } from "@/hooks/artists/useRemoveArtist";
import { TbTrashX } from "react-icons/tb";
import { FiEdit } from "react-icons/fi";
import { MdOutlineAdd } from "react-icons/md";
import { ResponsiveList } from "@/components/admin/ResponsiveList";
import { Pagination } from "@/components/ui/pagination";
import { PageSizeSelector } from "@/components/ui/page-size-selector";
import { useTableParams } from "@/hooks/useTableParams";

export default function AdminArtistsPage() {
  const { page, pageSize, changePage, changePageSize } = useTableParams(2);
  const { data, error, isError, isLoading } = useArtists(page, pageSize);
  const removeArtist = useRemoveArtist();

  // Throw to global error boundary
  if (isError && error) throw error;

  const items = data?.items ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data ? Math.ceil(total / data.meta.pageSize) : 0;

  // Empty state
  if (!items.length && !isLoading) {
    return (
      <EmptyState
        message="No artists yet."
        actionHref="/admin/artists/new"
        actionLabel="Create Artist"
      />
    );
  }

  //Add: artist avatar, country flag

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Artists</h1>
        </div>

        <Button asChild>
          <Link href="/admin/artists/new">
            <div className="flex items-center gap-1">
              <MdOutlineAdd size={22} />
              <span>New Artist</span>
            </div>
          </Link>
        </Button>
      </header>

      <ResponsiveList
        items={items}
        isLoading={isLoading}
        loadingContent={
          <Card className="p-4 text-sm text-zinc-500">Loading artists…</Card>
        }
        renderTable={(items) => (
          <Card className="p-0">
            <table className="w-full border-t border-zinc-200 text-sm dark:border-zinc-800">
              <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-2">Name</th>
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
                    <td className="px-4 py-2">{artist.name}</td>
                    <td className="px-4 py-2">
                      {artist.country || (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
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
              <Card key={artist.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{artist.name}</div>
                    <div className="text-xs text-zinc-500">
                      {artist.country || "Unknown country"}
                    </div>
                  </div>

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
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-4 text-xs">
          <PageSizeSelector
            value={pageSize}
            onChange={changePageSize}
            options={[1, 2, 5]}
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
