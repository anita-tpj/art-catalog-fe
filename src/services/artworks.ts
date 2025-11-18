import { get, post } from "@/lib/api-client";
import { z } from "zod";

export interface Artwork {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  year?: number | null;
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

  category: z.enum(
    ["PAINTING", "SCULPTURE", "DIGITAL", "PHOTOGRAPHY", "OTHER"],
    {
      message: "Category is required",
    }
  ),
});

export type CreateArtworkDTO = z.infer<typeof CreateArtworkSchema>;

export const artworksService = {
  getAll: () => get<Artwork[]>("/api/artworks"),
  create: (data: CreateArtworkDTO) =>
    post<Artwork, CreateArtworkDTO>("/api/artworks", data),
  getById: (id: number) => get<Artwork>(`/api/artworks/${id}`),
};
