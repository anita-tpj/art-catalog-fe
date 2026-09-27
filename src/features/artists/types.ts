import { CURRENT_YEAR, DEFAULT_MIN_YEAR } from "@/lib/year-options";
import { ItemStatus, ItemVisibility } from "@/types/item";
import { z } from "zod";
import { Artwork, ArtworkCategory } from "../artworks/types";

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
  status: ItemStatus;
  visibility: ItemVisibility;
  slug: string | null;
  slugLocked: boolean;
  artworks?: Artwork[];
}

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

  status: z.nativeEnum(ItemStatus).default(ItemStatus.DRAFT),

  visibility: z.nativeEnum(ItemVisibility).default(ItemVisibility.PRIVATE),

  slug: z.preprocess(
    (value) => (value === "" ? null : value),
    z
      .string()
      .trim()
      .min(3, "Slug must be at least 3 characters")
      .max(50, "Slug must be at most 50 characters")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use only lowercase letters, numbers and hyphens",
      )
      .nullable()
      .optional(),
  ),
});

export const UpdateArtistSchema = createArtistSchema.partial();

export type CreateArtistDTO = z.infer<typeof createArtistSchema>;
export type UpdateArtistDTO = z.infer<typeof UpdateArtistSchema>;
