const removeTrailingSlash = (url: string) => url.replace(/\/+$/, "");

export const URLS = {
  artCatalog: removeTrailingSlash(
    process.env.NEXT_PUBLIC_ART_CATALOG_URL || "http://localhost:3000",
  ),
  creativeAtlas: removeTrailingSlash(
    process.env.NEXT_PUBLIC_CREATIVE_ATLAS_URL || "https://creativeatlas.co",
  ),
};
