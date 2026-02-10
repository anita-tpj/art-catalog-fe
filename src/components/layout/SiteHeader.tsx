import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:bg-zinc-900/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          ArtCatalog
        </Link>

        <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <Link
            href="/artworks"
            className="hover:text-black dark:hover:text-white"
          >
            Gallery
          </Link>
          <Link
            href="/admin"
            className="rounded-full border px-3 py-1 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
