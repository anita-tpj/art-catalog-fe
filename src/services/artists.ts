import { get, post } from "@/lib/api-client";
import { z } from "zod";

export interface Artist {
  id: number;
  name: string;
  bio?: string;
  country?: string;
  birthYear?: number;
  deathYear?: number;
}

const optionalYear = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  },
  z
    .number()
    .int()
    .min(1800, { message: "Year must be greater than 1800" })
    .max(new Date().getFullYear(), {
      message: "Year cannot be in the future",
    })
    .optional()
);

export const createArtistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().max(2000, "Description is too long").optional(),
  country: z.string().optional(),
  birthYear: optionalYear,
  deathYear: optionalYear,
});

export type CreateArtistDTO = z.infer<typeof createArtistSchema>;

export const artistsService = {
  getAll: () => get<Artist[]>("/api/artists"),
  create: (data: CreateArtistDTO) =>
    post<Artist, CreateArtistDTO>("/api/artists", data),
};
