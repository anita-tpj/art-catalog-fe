// app/artworks/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MdArrowBack } from "react-icons/md";

import type { Artwork } from "@/services/artworks";
import {
  ArtworkCategoryLabels,
  ArtworkTechniqueLabels,
  ArtworkStyleLabels,
  ArtworkMotiveLabels,
  ArtworkOrientationLabels,
  ArtworkStandardSizeLabels,
} from "@/services/artworks";

export const revalidate = 60;

type PageProps = { params: Promise<{ id: string }> };

type DetailItem = { label: string; value: string };

function parseIdOrNotFound(idParam: string) {
  const id = Number(idParam);
  if (!Number.isFinite(id)) notFound();
  return id;
}

function getApiBaseUrlOrThrow() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }
  return base;
}

async function fetchArtworkOrNull(id: number): Promise<Artwork | null> {
  const apiBase = getApiBaseUrlOrThrow();
  const url = `${apiBase}/api/artworks/${id}`;

  const res = await fetch(url, {
    next: { revalidate },
    headers: { accept: "application/json" },
  });

  if (!res.ok) return null;
  return (await res.json()) as Artwork;
}

function getArtistName(artwork: Artwork) {
  return artwork.artist?.name ?? "Unknown artist";
}

function getSubtitle(artwork: Artwork) {
  const artistName = getArtistName(artwork);
  return [
    artistName,
    artwork.year ? String(artwork.year) : null,
    artwork.technique ? ArtworkTechniqueLabels[artwork.technique] : null,
  ]
    .filter(Boolean)
    .join(" • ");
}

function toDetail(label: string, value: string | null): DetailItem | null {
  return value ? { label, value } : null;
}

function getDetails(artwork: Artwork): DetailItem[] {
  return [
    toDetail("Category", ArtworkCategoryLabels[artwork.category]),
    toDetail(
      "Technique",
      artwork.technique ? ArtworkTechniqueLabels[artwork.technique] : null,
    ),
    toDetail("Style", artwork.style ? ArtworkStyleLabels[artwork.style] : null),
    toDetail(
      "Motive",
      artwork.motive ? ArtworkMotiveLabels[artwork.motive] : null,
    ),
    toDetail(
      "Orientation",
      artwork.orientation
        ? ArtworkOrientationLabels[artwork.orientation]
        : null,
    ),
    toDetail(
      "Size",
      artwork.size ? ArtworkStandardSizeLabels[artwork.size] : null,
    ),
    toDetail("Framed", artwork.framed ? "Yes" : "No"),
  ].filter((x): x is DetailItem => Boolean(x));
}

export async function generateMetadata({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) return { title: "Artwork not found" };

  const artwork = await fetchArtworkOrNull(id);
  if (!artwork) return { title: "Artwork not found" };

  const title = `${artwork.title} — ${artwork.artist.name}`;

  return {
    title,
    description: artwork.description ?? undefined,
    openGraph: {
      title,
      description: artwork.description ?? undefined,
      images: artwork.imageUrl ? [{ url: artwork.imageUrl }] : undefined,
    },
  };
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = parseIdOrNotFound(idParam);

  const artwork = await fetchArtworkOrNull(id);
  if (!artwork) notFound();

  const subtitle = getSubtitle(artwork);
  const details = getDetails(artwork);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/artworks"
          className="text-sm underline underline-offset-4 flex items-center gap-0.5"
        >
          <MdArrowBack />
          Back to artworks
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* LEFT */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-2xl border bg-muted">
            <div className="relative w-full aspect-4/3">
              {artwork.imageUrl ? (
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>
          </div>
          <div className="lg:hidden mt-4">
            <h1 className="text-xl font-semibold tracking-tight">
              {artwork.title}
            </h1>
            {subtitle ? (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>

          {artwork.description ? (
            <div className="mt-6 space-y-2">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {artwork.description}
              </p>
            </div>
          ) : null}
        </div>

        {/* RIGHT */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="max-lg:hidden">
            <h1 className="text-2xl font-semibold tracking-tight">
              {artwork.title}
            </h1>
            {subtitle ? (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border p-4">
            {details.map((d) => (
              <div key={d.label} className="space-y-1">
                <dt className="text-xs text-muted-foreground">{d.label}</dt>
                <dd className="text-sm font-medium">{d.value}</dd>
              </div>
            ))}
          </dl>

          <div className="sticky top-6 rounded-2xl border p-4 space-y-3">
            <div className="text-sm">
              <div className="font-medium">Interested in this piece?</div>
              <div className="text-muted-foreground">
                Send an inquiry and we’ll get back to you.
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                href={`/contact?artworkId=${encodeURIComponent(
                  String(artwork.id),
                )}`}
              >
                Contact about this artwork
              </Link>

              <Link
                className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium"
                href="/artworks"
              >
                View all artworks
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
