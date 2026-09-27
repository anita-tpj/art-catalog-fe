// app/artworks/[id]/page.tsx
import { Button } from "@/components/ui";
import {
  Artwork,
  ArtworkAvailability,
  ArtworkAvailabilityLabels,
  ArtworkCategoryLabels,
  ArtworkMotiveLabels,
  ArtworkOrientationLabels,
  ArtworkStandardSizeLabels,
  ArtworkStyleLabels,
  ArtworkTechniqueLabels,
} from "@/features/artworks/types";
import { getTranslation } from "@/i18n/server";
import { getById } from "@/lib/api-client";
import { parseIdOrNotFound } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

export const revalidate = 0;

type PageProps = { params: Promise<{ id: string }> };

type DetailItem = { label: string; value: string };

function getArtistName(artwork: Artwork) {
  return artwork.artist?.name ?? "Unknown artist";
}

function getSubtitle(artwork: Artwork, t: (key: string) => string) {
  const artistName = getArtistName(artwork);
  return [
    artistName,
    artwork.year ? String(artwork.year) : null,
    artwork.technique ? t(ArtworkTechniqueLabels[artwork.technique]) : null,
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

const availabilityStyles: Record<ArtworkAvailability, string> = {
  [ArtworkAvailability.AVAILABLE]:
    "border-emerald-200 bg-emerald-50 text-emerald-700",

  [ArtworkAvailability.RESERVED]: "border-amber-200 bg-amber-50 text-amber-700",

  [ArtworkAvailability.SOLD]: "border-rose-200 bg-rose-50 text-rose-700",

  [ArtworkAvailability.NOT_FOR_SALE]:
    "border-stone-300 bg-stone-100 text-stone-800",
};

function AvailabilityBadge({
  artwork,
  t,
}: {
  artwork: Artwork;
  t: (key: string) => string;
}) {
  return (
    <span
      className={`inline-flex mt-2 rounded-full border px-2.5 py-1 text-xs font-medium ${
        availabilityStyles[artwork.availability]
      }`}
    >
      {t(ArtworkAvailabilityLabels[artwork.availability])}
    </span>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) return { title: "Artwork not found" };

  try {
    const artwork = await getById<Artwork>("/api/artworks/public", id, {
      revalidate,
    });
    const title = `${artwork.title} — ${artwork.artist?.name ?? "Unknown artist"} | ArtCatalog`;

    return {
      title,
      description: artwork.description ?? undefined,
      openGraph: {
        title,
        description: artwork.description ?? undefined,
        images: artwork.imageUrl ? [{ url: artwork.imageUrl }] : undefined,
      },
    };
  } catch {
    return { title: "Artwork not found" };
  }
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { t } = await getTranslation();
  const { id: idParam } = await params;
  const id = parseIdOrNotFound(idParam);

  let artwork: Artwork;

  try {
    artwork = await getById<Artwork>("/api/artworks/public", id, {
      revalidate,
    });
  } catch {
    notFound();
  }

  const subtitle = getSubtitle(artwork, t);
  const details = getDetails(artwork);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/artworks"
          className="text-sm underline underline-offset-4 flex items-center gap-0.5"
        >
          <MdArrowBack />
          {t("Back to artworks")}
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
                  {t("No image")}
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
            <AvailabilityBadge artwork={artwork} t={t} />
          </div>

          {artwork.description ? (
            <div className="mt-6 space-y-2">
              <h2 className="text-lg font-semibold">{t("About artwork")}</h2>
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
            <AvailabilityBadge artwork={artwork} t={t} />
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border p-4">
            {details.map((d) => (
              <div key={d.label} className="space-y-1">
                <dt className="text-xs text-muted-foreground">{t(d.label)}</dt>
                <dd className="text-sm font-medium">{t(d.value)}</dd>
              </div>
            ))}
          </dl>

          <div className="sticky top-6 rounded-2xl border p-4 space-y-3">
            <div className="text-sm">
              <div className="font-medium">
                {t("Interested in this piece?")}
              </div>
              <div className="text-muted-foreground">
                {t("Send an inquiry and we'll get back to you.")}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                  href={`/contact?artworkId=${encodeURIComponent(
                    String(artwork.id),
                  )}&from=artwork`}
                >
                  {t("Contact about this artwork")}
                </Link>
              </Button>

              {artwork.artistId ? (
                <Button asChild variant="outline">
                  <Link
                    href={`/${artwork.artist.slug}`}
                    className="inline-flex h-10 items-center gap-0.5 justify-center rounded-md border px-4 text-sm font-medium"
                  >
                    {t("More from this artist")}
                    <MdArrowForward />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
