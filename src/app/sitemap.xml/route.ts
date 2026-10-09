import type { Artist } from "@/features/artists/types";
import type { Artwork } from "@/features/artworks/types";
import { get } from "@/lib/api-client";
import { URLS } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type PaginatedResult<T> = {
  items: T[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  };
};

type SitemapEntry = {
  url: string;
};

async function getAllPublished<T>(endpoint: string): Promise<T[]> {
  const items: T[] = [];
  let page = 1;

  while (true) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
    });

    const result = await get<PaginatedResult<T>>(
      `${endpoint}?${params.toString()}`,
      { revalidate: 0 },
    );

    items.push(...result.items);

    if (page >= result.meta.totalPages) {
      break;
    }

    page++;
  }

  return items;
}

function escapeXml(value: string): string {
  const entities: Record<string, string> = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
  };

  return value.replace(/[<>&"']/g, (char) => entities[char]);
}

function createSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map(({ url }) => `<url><loc>${escapeXml(url)}</loc></url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function GET(request: NextRequest) {
  const hostname = request.nextUrl.hostname;

  const creativeAtlasHostname = new URL(URLS.creativeAtlas).hostname;
  const artCatalogHostname = new URL(URLS.artCatalog).hostname;

  let entries: SitemapEntry[];

  try {
    if (hostname === creativeAtlasHostname) {
      const artists = await getAllPublished<Artist>("/api/artists/public");

      entries = artists
        .filter(
          (artist) =>
            artist.status === "PUBLISHED" &&
            artist.visibility === "PUBLIC" &&
            Boolean(artist.slug),
        )
        .map((artist) => ({
          url: `${URLS.creativeAtlas}/${encodeURIComponent(artist.slug!)}`,
        }));
    } else if (hostname === artCatalogHostname) {
      const artworks = await getAllPublished<Artwork>("/api/artworks/public");

      entries = [
        { url: `${URLS.artCatalog}/` },
        { url: `${URLS.artCatalog}/artists` },
        { url: `${URLS.artCatalog}/artworks` },
        { url: `${URLS.artCatalog}/about` },
        { url: `${URLS.artCatalog}/contact` },
        ...artworks
          .filter(
            (artwork) =>
              artwork.status === "PUBLISHED" &&
              artwork.artist?.status === "PUBLISHED" &&
              artwork.artist?.visibility === "PUBLIC",
          )
          .map((artwork) => ({
            url: `${URLS.artCatalog}/artworks/${artwork.id}`,
          })),
      ];
    } else {
      return new NextResponse("Not found", { status: 404 });
    }
  } catch (error) {
    console.error("Failed to generate sitemap:", error);

    return new NextResponse("Failed to generate sitemap", {
      status: 503,
    });
  }

  return new NextResponse(createSitemap(entries), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
