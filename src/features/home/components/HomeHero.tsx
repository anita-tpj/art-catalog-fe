import Link from "next/link";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white px-8 py-10 shadow-sm sm:px-10 sm:py-12 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="max-w-2xl">
        <div className="inline-flex items-center rounded-full border border-zinc-200/70 bg-zinc-50/70 px-3 py-1 text-xs text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-950/30 dark:text-zinc-300">
          Curated collection
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          ArtCatalog
        </h1>

        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          Explore a curated selection of artworks and artists. Discover new
          pieces and the creators behind them.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/artworks"
            className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 hover:shadow-md dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Browse gallery
          </Link>

          <Link
            href="/artists"
            className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
          >
            View artists
          </Link>
        </div>
      </div>
    </section>
  );
}
