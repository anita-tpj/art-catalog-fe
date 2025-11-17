import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminArtworksPage() {
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

      <Card className="text-sm text-zinc-500 dark:text-zinc-400 border-dashed">
        Table with artworks will go here (query, filters, pagination…)
      </Card>
    </section>
  );
}
