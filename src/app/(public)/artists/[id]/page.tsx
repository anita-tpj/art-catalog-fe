// app/artists/[id]/page.tsx
import { Button } from "@/components/ui";
import { Artist } from "@/features/artists/types";
import { ArtworkCategoryLabels } from "@/features/artworks/types";
import { get, getById } from "@/lib/api-client";
import { parseIdOrNotFound } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

export const revalidate = 60;

type PageProps = { params: Promise<{ id: string }> };

type ArtworkCardItem = {
  id: number;
  title: string;
  imageUrl: string | null;
  year: number | null;
  category: keyof typeof ArtworkCategoryLabels | string;
};

async function fetchArtistArtworks(artistId: number) {
  const params = new URLSearchParams({
    page: "1",
    pageSize: "12",
    artistId: String(artistId),
  });

  try {
    return await get<{ items: ArtworkCardItem[]; total: number }>(
      `/api/artworks?${params.toString()}`,
      { revalidate },
    );
  } catch {
    return { items: [], total: 0 };
  }
}

function getLifeSpan(artist: Artist) {
  const b = artist.birthYear ?? null;
  const d = artist.deathYear ?? null;
  if (!b && !d) return null;
  if (b && d) return `${b}–${d}`;
  if (b && !d) return `${b}–`;
  return `–${d}`;
}

function getArtistMetaBadges(artist: Artist) {
  const badges: Array<{ label: string; value: string }> = [];

  const lifeSpan = getLifeSpan(artist);
  if (lifeSpan) badges.push({ label: "Years", value: lifeSpan });

  if (artist.country?.trim())
    badges.push({ label: "Country", value: artist.country.trim() });

  if (artist.primaryCategory) {
    const pc = artist.primaryCategory as keyof typeof ArtworkCategoryLabels;
    badges.push({
      label: "Primary",
      value: ArtworkCategoryLabels[pc] ?? String(pc),
    });
  }

  return badges;
}

function formatArtworkCategory(category: ArtworkCardItem["category"]) {
  const key = category as keyof typeof ArtworkCategoryLabels;
  return ArtworkCategoryLabels[key] ?? String(category);
}

export async function generateMetadata({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) return { title: "Artist not found" };

  try {
    const artist = await getById<Artist>("/api/artists", id, { revalidate });

    const title = `${artist.name} — Artist | ArtCatalog`;
    const description = artist.bio ?? `Explore artworks by ${artist.name}.`;

    return {
      title,
      description,
      alternates: { canonical: `/artists/${id}` },
      openGraph: { title, description },
    };
  } catch {
    return { title: "Artist not found" };
  }
}

export default async function ArtistDetailPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = parseIdOrNotFound(idParam);

  let artist: Artist;

  try {
    artist = await getById<Artist>("/api/artists", id, { revalidate });
  } catch {
    notFound();
  }

  const artworks = await fetchArtistArtworks(id);
  const badges = getArtistMetaBadges(artist);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href="/artists"
          className="text-sm underline underline-offset-4 flex items-center gap-1"
        >
          <MdArrowBack />
          Back to artists
        </Link>

        <Link
          href={`/artworks?search=${encodeURIComponent(artist.name)}`}
          className="text-sm underline underline-offset-4 flex items-center gap-1"
        >
          Search artworks
          <MdArrowForward />
        </Link>
      </div>

      {/* Header card */}
      <section className="grid gap-6 rounded-2xl border p-6 lg:grid-cols-12">
        {/* Avatar */}
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-2xl border bg-muted">
            <div className="relative aspect-4/3">
              {artist.avatarUrl ? (
                <Image
                  src={artist.avatarUrl}
                  alt={artist.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {artist.name}
            </h1>

            {badges.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span
                    key={b.label}
                    className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                    title={b.label}
                  >
                    {b.value}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {artist.bio ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {artist.bio}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No bio yet.</p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link
                className="inline-flex h-10 items-center justify-center text-sm font-medium text-primary-foreground"
                href={`/contact?artistId=${encodeURIComponent(String(id))}&from=artist`}
              >
                Contact about this artist
              </Link>
            </Button>

            <Button asChild variant="outline">
              <Link
                className="inline-flex h-10 items-center justify-center text-sm font-medium"
                href={`/artworks?search=${encodeURIComponent(artist.name)}`}
              >
                View related artworks
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Artworks section */}
      <section className="mt-10 space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Artworks</h2>
            <p className="text-sm text-muted-foreground">
              Latest pieces by {artist.name}.
            </p>
          </div>

          <Link
            href={`/artworks?artistId=${encodeURIComponent(String(id))}`}
            className="text-sm underline underline-offset-4 flex items-center gap-0.5"
          >
            View all
            <MdArrowForward />
          </Link>
        </div>

        {artworks.items.length === 0 ? (
          <div className="rounded-2xl border p-8 text-center text-sm text-muted-foreground">
            No artworks found for this artist.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.items.map((a) => (
              <Link
                key={a.id}
                href={`/artworks/${a.id}`}
                className="
                  group overflow-hidden rounded-2xl border bg-background
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-md hover:border-muted-foreground/30
                "
              >
                <div className="relative aspect-4/3 bg-muted overflow-hidden">
                  {a.imageUrl ? (
                    <Image
                      src={a.imageUrl}
                      alt={a.title}
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
                      {a.title}
                    </h3>
                    {a.year ? (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {a.year}
                      </span>
                    ) : null}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {formatArtworkCategory(a.category)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
