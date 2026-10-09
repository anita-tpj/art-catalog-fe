import { URLS } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const hostname = request.nextUrl.hostname;

  const creativeAtlasHostname = new URL(URLS.creativeAtlas).hostname;
  const artCatalogHostname = new URL(URLS.artCatalog).hostname;

  let sitemapUrl: string;

  if (hostname === creativeAtlasHostname) {
    sitemapUrl = `${URLS.creativeAtlas}/sitemap.xml`;
  } else if (hostname === artCatalogHostname) {
    sitemapUrl = `${URLS.artCatalog}/sitemap.xml`;
  } else {
    return new NextResponse("Not found", { status: 404 });
  }

  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${sitemapUrl}
`;

  return new NextResponse(robots, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
