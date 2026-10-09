import { URLS } from "@/config/urls";
import { FeaturedArtists } from "@/features/home/components/FeaturedArtists";
import { FeaturedArtworks } from "@/features/home/components/FeaturedArtworks";
import { HomeCTA } from "@/features/home/components/HomeCTA";
import { HomeHero } from "@/features/home/components/HomeHero";
import { getTranslation } from "@/i18n/server";
import { API_BASE_URL } from "@/lib/config";
import type { Metadata } from "next";

type Artwork = {
  id: string;
  title: string;
  imageUrl?: string | null;
  artist?: { id: string; name: string } | null;
};

type Artist = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  slug: string;
};

async function fetchJson<T>(path: string, params?: Record<string, string>) {
  const url = new URL(path, API_BASE_URL);

  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }

  // Public requests only (no auth headers)
  const res = await fetch(url.toString(), {
    // Adjust if you want caching:
    // next: { revalidate: 60 },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as T;
}

async function getFeaturedArtworks(): Promise<Artwork[]> {
  try {
    const data = await fetchJson<any>("/api/artworks/public", {
      pageSize: "12",
    });

    return Array.isArray(data) ? data : (data.items ?? []);
  } catch {
    return [];
  }
}

async function getFeaturedArtists(): Promise<Artist[]> {
  try {
    const data = await fetchJson<any>("/api/artists/public", {
      pageSize: "6",
    });

    return Array.isArray(data) ? data : (data.items ?? []);
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();

  const title = "ArtCatalog";
  const description = t(
    "Explore a curated selection of artworks and artists. Discover new pieces and the creators behind them.",
  );

  return {
    title,
    description,
    alternates: {
      canonical: `${URLS.artCatalog}/`,
    },
    openGraph: {
      title,
      description,
      url: `${URLS.artCatalog}/`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HomePage() {
  const [artworks, artists] = await Promise.all([
    getFeaturedArtworks(),
    getFeaturedArtists(),
  ]);

  return (
    <div className="space-y-12 sm:space-y-14">
      <div className="fade-in-up fade-delay-1">
        <HomeHero />
      </div>

      <div className="border-t border-zinc-200 pt-10 sm:pt-12 dark:border-zinc-800 fade-in-up fade-delay-2">
        <FeaturedArtworks artworks={artworks} />
      </div>

      <div className="border-t border-zinc-200 pt-10 sm:pt-12 dark:border-zinc-800 fade-in-up fade-delay-3">
        <FeaturedArtists artists={artists} />
      </div>

      <div className="border-t border-zinc-200 pt-10 sm:pt-12 dark:border-zinc-800 fade-in-up fade-delay-4">
        <HomeCTA />
      </div>
    </div>
  );
}
