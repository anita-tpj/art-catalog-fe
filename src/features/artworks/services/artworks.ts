import { del, get, getById, post, put } from "@/lib/api-client";
import { PaginatedRequest, PaginatedResult } from "@/types/api";
import { Artwork, CreateArtworkDTO, UpdateArtworkDTO } from "../types";

export const artworksService = {
  getAll: () => get<Artwork[]>("/api/artworks/all"),
  //getById: (id: number) => get<Artwork>(`/api/artworks/${id}`),
  getPaginated: ({
    page,
    pageSize,
    search,
    category,
    artistId,
  }: PaginatedRequest) => {
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

    return get<PaginatedResult<Artwork>>(`/api/artworks?${params.toString()}`);
  },
  getOne: (id: number) => getById<Artwork>("/api/artworks", id),
  create: (data: CreateArtworkDTO) =>
    post<Artwork, CreateArtworkDTO>("/api/artworks", data),
  update: (id: number, data: UpdateArtworkDTO) =>
    put<Artwork, UpdateArtworkDTO>("/api/artworks", id, data),
  remove: (id: number) => del<Artwork>("/api/artworks", id),
};
