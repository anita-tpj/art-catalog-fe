"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useArtists } from "@/hooks/artists/useArtists";
import Link from "next/link";
import React from "react";

const AdminArtistsPage = () => {
  const { data, error, isLoading } = useArtists();

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Artists</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Manage all artists in your catalog.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/artists/new">+ New arist</Link>
        </Button>
      </header>

      <Card className="p-0">
        {isLoading && (
          <div className="p-4 text-sm text-zinc-500">Loading artists…</div>
        )}

        {error && (
          <div className="p-4 text-sm text-red-500">
            {(error as Error).message}
          </div>
        )}

        {data && data.length === 0 && !isLoading && !error && (
          <div className="p-4 text-sm text-zinc-500">
            No artists yet. Create your first one.
          </div>
        )}

        {data && data.length > 0 && (
          <table className="w-full border-t border-zinc-200 text-sm dark:border-zinc-800">
            <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Birth Year</th>
                <th className="px-4 py-2">Country</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((artist) => (
                <tr
                  key={artist.id}
                  className="border-t border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <td className="px-4 py-2">{artist.name}</td>
                  <td className="px-4 py-2">
                    {artist.birthYear ?? (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {artist.country ?? <span className="text-zinc-400">—</span>}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="px-2 text-xs"
                    >
                      <Link href={`/admin/artists/${artist.id}/edit`}>
                        Edit
                      </Link>
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
};

export default AdminArtistsPage;
