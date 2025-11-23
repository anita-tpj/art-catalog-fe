"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useArtworks } from "@/hooks/artworks/useArtworks";
import { useRemoveArtwork } from "@/hooks/artworks/useRemoveArtwork";

export default function AdminArtworksPage() {
  const { data, isLoading, error } = useArtworks();
  const removeArtwork = useRemoveArtwork();

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Artworks</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Manage all artworks in your catalog.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/artworks/new">+ New artwork</Link>
        </Button>
      </header>

      <Card className="p-0">
        {isLoading && (
          <div className="p-4 text-sm text-zinc-500">Loading artworks…</div>
        )}

        {error && (
          <div className="p-4 text-sm text-red-500">
            {(error as Error).message}
          </div>
        )}

        {data && data.length === 0 && !isLoading && !error && (
          <div className="p-4 text-sm text-zinc-500">
            No artworks yet. Create your first one.
          </div>
        )}

        {data && data.length > 0 && (
          <table className="w-full border-t border-zinc-200 text-sm dark:border-zinc-800">
            <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((artwork) => (
                <tr
                  key={artwork.id}
                  className="border-t border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <td className="px-4 py-2">{artwork.title}</td>
                  <td className="px-4 py-2">
                    {artwork.year ?? <span className="text-zinc-400">—</span>}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="px-2 text-xs"
                    >
                      <Link href={`/admin/artworks/${artwork.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-2 text-xs"
                      onClick={() => removeArtwork.mutate(artwork.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </section>
  );
}
