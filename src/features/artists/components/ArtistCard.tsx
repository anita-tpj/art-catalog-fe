import { ArtworkCategoryLabels } from "@/features/artworks/types";
import Image from "next/image";
import Link from "next/link";
import { Artist } from "../types";

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  return (
    <Link href={`/artists/${artist.id}`} className="block focus:outline-none">
      <article
        className="
          group overflow-hidden rounded-2xl border bg-background
          transition-all duration-200
          hover:-translate-y-0.5 hover:shadow-md hover:border-muted-foreground/30
        "
      >
        <div className="relative aspect-4/3 bg-muted overflow-hidden">
          {artist.avatarUrl ? (
            <Image
              src={artist.avatarUrl}
              alt={artist.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-black/15 to-transparent" />
        </div>

        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug group-hover:underline underline-offset-4">
              {artist.name}
            </h3>

            {artist.primaryCategory ? (
              <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                {ArtworkCategoryLabels[artist.primaryCategory]}
              </span>
            ) : null}

            {typeof artist.artworksCount === "number" ? (
              <span className="shrink-0 text-xs text-muted-foreground">
                {artist.artworksCount}
              </span>
            ) : null}
          </div>

          {artist.bio ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {artist.bio}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
};
