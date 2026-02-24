import { del, get, getById, post, put } from "@/lib/api-client";
import { PaginatedRequest, PaginatedResult } from "@/types/api";
import { Artist, CreateArtistDTO } from "../types";

export const artistsService = {
  getAll: () => get<Artist[]>("/api/artists/all"),

  // getAll: (page = 1, pageSize = 10) =>
  //   get<PaginatedResult<Artist>>(
  //     `/api/artists?page=${page}&pageSize=${pageSize}`
  //   ),

  getPaginated: ({
    page,
    pageSize,
    search,
    primaryCategory,
  }: PaginatedRequest) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (search && search.trim() !== "") {
      params.set("search", search.trim());
    }

    if (primaryCategory) params.set("primaryCategory", primaryCategory);

    return get<PaginatedResult<Artist>>(`/api/artists?${params.toString()}`);
  },

  getOne: (id: number) => getById<Artist>("/api/artists", id),
  create: (data: CreateArtistDTO) =>
    post<Artist, CreateArtistDTO>("/api/artists", data),
  update: (id: number, data: CreateArtistDTO) =>
    put<Artist, CreateArtistDTO>("/api/artists", id, data),
  remove: (id: number) => del<Artist>("/api/artists", id),
};
