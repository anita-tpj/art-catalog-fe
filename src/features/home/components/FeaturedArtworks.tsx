import Image from "next/image";
import Link from "next/link";
import { MdArrowForward } from "react-icons/md";

type Artwork = {
  id: string;
  title: string;
  imageUrl?: string | null;
  artist?: { id: string; name: string } | null;
};

export function FeaturedArtworks({ artworks }: { artworks: Artwork[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Featured artworks
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            A small selection from the gallery.
          </p>
        </div>

        <Link
          href="/artworks"
          className="flex items-center gap-0.5 rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          View all
          <MdArrowForward />
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
          No artworks available yet (or API not connected). Once you add
          artworks, they’ll appear here automatically.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artworks.slice(0, 12).map((a) => (
            <Link
              key={a.id}
              href={`/artworks/${a.id}`}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <div className="aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800">
                <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800">
                  {a.imageUrl ? (
                    <>
                      <Image
                        src={a.imageUrl}
                        alt={a.title}
                        width="605"
                        height="454"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-black/10 to-transparent" />
                    </>
                  ) : null}
                </div>
              </div>

              <div className="p-4">
                <div className="text-sm font-medium text-zinc-900 dark:text-white">
                  {a.title}
                </div>
                {a.artist?.name ? (
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                    {a.artist.name}
                  </div>
                ) : (
                  <div className="mt-1 text-xs text-zinc-500"> </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
