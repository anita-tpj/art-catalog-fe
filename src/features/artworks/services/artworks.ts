import { del, get, getById, post, put } from "@/lib/api-client";
import { PaginatedRequest, PaginatedResult } from "@/types/api";
import { Artwork, CreateArtworkDTO, UpdateArtworkDTO } from "../types";

function buildPaginatedParams({
  page,
  pageSize,
  search,
  category,
  artistId,
  artist,
}: PaginatedRequest) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  if (category) {
    params.set("category", category);
  }

  if (artistId) {
    params.set("artistId", String(artistId));
  }

  if (artist?.trim()) {
    params.set("artist", artist.trim());
  }

  return params;
}
export const artworksService = {
  // Admin
  getAll: () =>
    get<Artwork[]>("/api/artworks/all"),

  getPaginated: (params: PaginatedRequest) => {
    const query = buildPaginatedParams(params);

    return get<PaginatedResult<Artwork>>(
      `/api/artworks?${query.toString()}`,
    );
  },

  getOne: (id: number) =>
    getById<Artwork>("/api/artworks", id),

  create: (data: CreateArtworkDTO) =>
    post<Artwork, CreateArtworkDTO>("/api/artworks", data),

  update: (id: number, data: UpdateArtworkDTO) =>
    put<Artwork, UpdateArtworkDTO>("/api/artworks", id, data),

  remove: (id: number) =>
    del<Artwork>("/api/artworks", id),

  // Public
  getAllPublished: () =>
    get<Artwork[]>("/api/artworks/public/all"),

  getPaginatedPublished: (params: PaginatedRequest) => {
    const query = buildPaginatedParams(params);

    return get<PaginatedResult<Artwork>>(
      `/api/artworks/public?${query.toString()}`,
    );
  },

  getPublishedOne: (id: number) =>
    getById<Artwork>("/api/artworks/public", id),
};