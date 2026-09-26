import { del, get, getById, post, put } from "@/lib/api-client";
import { PaginatedRequest, PaginatedResult } from "@/types/api";
import { Artist, CreateArtistDTO } from "../types";

function buildPaginatedParams({
  page,
  pageSize,
  search,
  primaryCategory,
}: PaginatedRequest) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (search && search.trim() !== "") {
    params.set("search", search.trim());
  }

  if (primaryCategory) {
    params.set("primaryCategory", primaryCategory);
  }

  return params;
}

export const artistsService = {
  // Admin
  getAll: () => get<Artist[]>("/api/artists/all"),

  getPaginated: (params: PaginatedRequest) => {
    const query = buildPaginatedParams(params);

    return get<PaginatedResult<Artist>>(`/api/artists?${query.toString()}`);
  },

  getOne: (id: number) => getById<Artist>("/api/artists", id),

  create: (data: CreateArtistDTO) =>
    post<Artist, CreateArtistDTO>("/api/artists", data),

  update: (id: number, data: CreateArtistDTO) =>
    put<Artist, CreateArtistDTO>("/api/artists", id, data),

  remove: (id: number) => del<Artist>("/api/artists", id),

  // Public
  getAllPublished: () => get<Artist[]>("/api/artists/public/all"),

  getPaginatedPublished: (params: PaginatedRequest) => {
    const query = buildPaginatedParams(params);

    return get<PaginatedResult<Artist>>(
      `/api/artists/public?${query.toString()}`,
    );
  },

  getPublishedOne: (id: number) => getById<Artist>("/api/artists/public", id),
};
