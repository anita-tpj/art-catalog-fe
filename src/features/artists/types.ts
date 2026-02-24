import { CURRENT_YEAR, DEFAULT_MIN_YEAR } from "@/lib/year-options";
import { z } from "zod";
import { ArtworkCategory } from "../artworks/types";

export interface Artist {
  id: number;
  name: string;
  bio: string | null;
  country: string | null;
  birthYear: number | null;
  deathYear: number | null;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  primaryCategory: ArtworkCategory;
  artworksCount: number | null;
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
    .optional(),
);

export const createArtistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().max(2000, "Description is too long").optional(),
  country: z.string().optional(),

  birthYear: z
    .number()
    .int()
    .min(DEFAULT_MIN_YEAR, {
      message: `Year must be greater than ${DEFAULT_MIN_YEAR}`,
    })
    .max(CURRENT_YEAR, {
      message: "Year cannot be in the future",
    })
    .optional(),
  deathYear: z
    .number()
    .int()
    .min(DEFAULT_MIN_YEAR, {
      message: `Year must be greater than ${DEFAULT_MIN_YEAR}`,
    })
    .max(CURRENT_YEAR, {
      message: "Year cannot be in the future",
    })
    .optional(),
  avatarUrl: z.string().url("Must be a valid URL").optional(),
  avatarPublicId: z.string().optional(),
  primaryCategory: z.nativeEnum(ArtworkCategory, {
    error: "Category is required",
  }),
});

export const UpdateArtistSchema = createArtistSchema.partial();

export type CreateArtistDTO = z.infer<typeof createArtistSchema>;
export type UpdateArtistDTO = z.infer<typeof UpdateArtistSchema>;
