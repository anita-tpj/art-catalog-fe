import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white/60 py-6 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} ArtCatalog</span>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-zinc-400">
            Curated artworks & artists
          </span>

          <Link
            href="/admin"
            className="text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
