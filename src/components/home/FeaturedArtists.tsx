import Link from "next/link";
import { MdArrowForward } from "react-icons/md";

type Artist = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

export function FeaturedArtists({ artists }: { artists: Artist[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Featured artists
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Meet the creators behind the work.
          </p>
        </div>

        <Link
          href="/artists"
          className="flex items-center gap-0.5 rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          View all
          <MdArrowForward />
        </Link>
      </div>

      {artists.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
          No artists yet (or API not connected). Once you add artists, they’ll
          appear here automatically.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artists.slice(0, 6).map((a) => (
            <Link
              key={a.id}
              href={`/artists/${a.id}`}
              className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <div className="h-12 w-12 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                {a.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.avatarUrl}
                    alt={a.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                  {a.name}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300">
                  View profile
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
