import { Artwork } from "@/services/artworks";
import Image from "next/image";

interface ArtworkCardProps {
  artwork: Artwork;
}

export const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  return (
    <article
      key={artwork.id}
      className="
        group overflow-hidden rounded-2xl border bg-background
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md hover:border-muted-foreground/30
      "
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {artwork.imageUrl ? (
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
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
            {artwork.title}
          </h3>
          {artwork.year ? (
            <span className="shrink-0 text-xs text-muted-foreground">
              {artwork.year}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {artwork.category ? (
            <span className="rounded-full border px-2 py-0.5">
              {artwork.category}
            </span>
          ) : null}
          {artwork.artist ? (
            <span className="rounded-full border px-2 py-0.5">
              {artwork.artist.name}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
};
