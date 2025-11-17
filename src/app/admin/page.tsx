"use client";

import { useArtworks } from "@/hooks/useArtWorks";


export default function AdminDashboardPage() {
  const { data, isLoading, error } = useArtworks();

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>

      {isLoading && <p>Loading artworks…</p>}
      {error && <p className="text-red-500">Error loading artworks</p>}
      {data && (
        <pre className="mt-4 text-xs">{JSON.stringify(data, null, 2)}</pre>
      )}
    </section>
  );
}
