import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:bg-zinc-900/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          ArtCatalog
        </Link>

        <nav className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300 lg:gap-6">
          <Link
            href="/artworks"
            className="hover:text-black dark:hover:text-white"
          >
            Gallery
          </Link>

          <Link
            href="/artists"
            className="hover:text-black dark:hover:text-white"
          >
            Artists
          </Link>

          <Link
            href="/about"
            className="hover:text-black dark:hover:text-white"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="hover:text-black dark:hover:text-white"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
