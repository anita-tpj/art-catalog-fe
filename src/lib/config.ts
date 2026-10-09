export const API_BASE_URL = (
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5000"
).replace(/\/$/, "");

const removeTrailingSlash = (url: string) => url.replace(/\/+$/, "");

export const URLS = {
  artCatalog: removeTrailingSlash(
    process.env.NEXT_PUBLIC_ART_CATALOG_URL || "http://localhost:3000",
  ),
  creativeAtlas: removeTrailingSlash(
    process.env.NEXT_PUBLIC_CREATIVE_ATLAS_URL || "https://creativeatlas.co",
  ),
};


export const SEO_INDEXING_ENABLED =
  process.env.SEO_INDEXING_ENABLED === "true";
