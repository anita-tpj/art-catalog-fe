import { del, get, getById, post, put } from "@/lib/api-client";
import { PaginatedResult } from "@/types/api";
import { z } from "zod";

export enum ArtworkCategory {
  PAINTING = "PAINTING",
  SCULPTURE = "SCULPTURE",
  DIGITAL = "DIGITAL",
  PHOTOGRAPHY = "PHOTOGRAPHY",
  OTHER = "OTHER",
}

export interface Artwork {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  year: number | null;
  category: ArtworkCategory;
  artistId: number;
}

export const CreateArtworkSchema = z.object({
  title: z.string().min(1, "Title is required"),

  year: z
    .number()
    .int()
    .min(1800, { message: "Year must be greater than 1800" })
    .max(new Date().getFullYear(), {
      message: "Year cannot be in the future",
    })
    .optional(),

  imageUrl: z.string().url("Must be a valid URL").optional(),

  description: z.string().max(2000, "Description is too long").optional(),
  artistId: z.number().int().positive({ message: "Artist is required" }),

  category: z.enum(ArtworkCategory, {
    message: "Category is required",
  }),
});

export type CreateArtworkDTO = z.infer<typeof CreateArtworkSchema>;

export const artworksService = {
  //getAll: () => get<Artwork[]>("/api/artworks"),
  //getById: (id: number) => get<Artwork>(`/api/artworks/${id}`),
  getAll: (page = 1, pageSize = 10) =>
    get<PaginatedResult<Artwork>>(
      `/api/artworks?page=${page}&pageSize=${pageSize}`
    ),
  getOne: (id: number) => getById<Artwork>("/api/artworks", id),
  create: (data: CreateArtworkDTO) =>
    post<Artwork, CreateArtworkDTO>("/api/artworks", data),
  update: (id: number, data: CreateArtworkDTO) =>
    put<Artwork, CreateArtworkDTO>("/api/artworks", id, data),
  remove: (id: number) => del<Artwork>("/api/artworks", id),
};
