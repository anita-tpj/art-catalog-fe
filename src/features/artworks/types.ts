import { CURRENT_YEAR, DEFAULT_MIN_YEAR } from "@/lib/year-options";
import { ItemStatus } from "@/types/item";
import { z } from "zod";

export enum ArtworkCategory {
  PAINTING = "PAINTING",
  SCULPTURE = "SCULPTURE",
  PHOTOGRAPHY = "PHOTOGRAPHY",
  DRAWING_ILLUSTRATION = "DRAWING_ILLUSTRATION",
  PRINTMAKING = "PRINTMAKING",
  DIGITAL_ART = "DIGITAL_ART",
  MIXED_MEDIA = "MIXED_MEDIA",
  TEXTILE_FIBER_ART = "TEXTILE_FIBER_ART",
  CERAMICS = "CERAMICS",
  OTHER = "OTHER",
}

export const ArtworkCategoryLabels: Record<ArtworkCategory, string> = {
  [ArtworkCategory.PAINTING]: "Painting",
  [ArtworkCategory.SCULPTURE]: "Sculpture",
  [ArtworkCategory.PHOTOGRAPHY]: "Photography",
  [ArtworkCategory.DRAWING_ILLUSTRATION]: "Drawing & Illustration",
  [ArtworkCategory.PRINTMAKING]: "Printmaking",
  [ArtworkCategory.DIGITAL_ART]: "Digital Art",
  [ArtworkCategory.MIXED_MEDIA]: "Mixed Media",
  [ArtworkCategory.TEXTILE_FIBER_ART]: "Textile & Fiber Art",
  [ArtworkCategory.CERAMICS]: "Ceramics",
  [ArtworkCategory.OTHER]: "Other",
};

export enum ArtworkTechnique {
  OIL = "OIL",
  ACRYLIC = "ACRYLIC",
  WATERCOLOR = "WATERCOLOR",
  GOUACHE = "GOUACHE",
  INK = "INK",
  MIXED_MEDIA = "MIXED_MEDIA",
  DIGITAL_PAINTING = "DIGITAL_PAINTING",
  PASTEL = "PASTEL",
  PENCIL = "PENCIL",
  CHARCOAL = "CHARCOAL",
  PRINT = "PRINT",
  SPRAY_PAINT = "SPRAY_PAINT",
  COLLAGE = "COLLAGE",
  OTHER = "OTHER",
}

export const ArtworkTechniqueLabels: Record<ArtworkTechnique, string> = {
  OIL: "Oil",
  ACRYLIC: "Acrylic",
  WATERCOLOR: "Watercolor",
  GOUACHE: "Gouache",
  INK: "Ink",
  MIXED_MEDIA: "Mixed Media",
  DIGITAL_PAINTING: "Digital Painting",
  PASTEL: "Pastel",
  PENCIL: "Pencil",
  CHARCOAL: "Charcoal",
  PRINT: "Print",
  SPRAY_PAINT: "Spray Paint",
  COLLAGE: "Collage",
  OTHER: "Other",
};

export enum ArtworkStyle {
  REALISM = "REALISM",
  ABSTRACT = "ABSTRACT",
  EXPRESSIONISM = "EXPRESSIONISM",
  IMPRESSIONISM = "IMPRESSIONISM",
  MINIMALISM = "MINIMALISM",
  SURREALISM = "SURREALISM",
  POP_ART = "POP_ART",
  CUBISM = "CUBISM",
  CONTEMPORARY = "CONTEMPORARY",
  STREET_ART = "STREET_ART",
  FIGURATIVE = "FIGURATIVE",
  CONCEPTUAL = "CONCEPTUAL",
  MODERN = "MODERN",
  OTHER = "OTHER",
}

export const ArtworkStyleLabels: Record<ArtworkStyle, string> = {
  REALISM: "Realism",
  ABSTRACT: "Abstract",
  EXPRESSIONISM: "Expressionism",
  IMPRESSIONISM: "Impressionism",
  MINIMALISM: "Minimalism",
  SURREALISM: "Surrealism",
  POP_ART: "Pop Art",
  CUBISM: "Cubism",
  CONTEMPORARY: "Contemporary",
  STREET_ART: "Street Art",
  FIGURATIVE: "Figurative",
  CONCEPTUAL: "Conceptual",
  MODERN: "Modern",
  OTHER: "Other",
};

export enum ArtworkMotive {
  ABSTRACT = "ABSTRACT",
  ARCHITECTURE = "ARCHITECTURE",
  PORTRAIT = "PORTRAIT",
  LANDSCAPE = "LANDSCAPE",
  STILL_LIFE = "STILL_LIFE",
  ANIMALS = "ANIMALS",
  FIGURE = "FIGURE",
  CITYSCAPE = "CITYSCAPE",
  NATURE = "NATURE",
  RELIGIOUS_MYTHOLOGICAL = "RELIGIOUS_MYTHOLOGICAL",
  FANTASY_SCI_FI = "FANTASY_SCI_FI",
  GEOMETRIC = "GEOMETRIC",
  TYPOGRAPHY = "TYPOGRAPHY",
  SOCIAL_POLITICAL = "SOCIAL_POLITICAL",
  OTHER = "OTHER",
}

export const ArtworkMotiveLabels: Record<ArtworkMotive, string> = {
  ARCHITECTURE: "Architecture",
  ABSTRACT: "Abstract",
  PORTRAIT: "Portrait",
  LANDSCAPE: "Landscape",
  STILL_LIFE: "Still Life",
  ANIMALS: "Animals / Wildlife",
  FIGURE: "Figure / Nude",
  CITYSCAPE: "Cityscape",
  NATURE: "Nature / Botanical",
  RELIGIOUS_MYTHOLOGICAL: "Religious / Mythological",
  FANTASY_SCI_FI: "Fantasy / Sci-Fi",
  GEOMETRIC: "Geometric",
  TYPOGRAPHY: "Typography",
  SOCIAL_POLITICAL: "Social / Political",
  OTHER: "Other",
};

export enum ArtworkOrientation {
  PORTRAIT = "PORTRAIT",
  LANDSCAPE = "LANDSCAPE",
  SQUARE = "SQUARE",
  PANORAMIC = "PANORAMIC",
}

export const ArtworkOrientationLabels: Record<ArtworkOrientation, string> = {
  PORTRAIT: "Portrait",
  LANDSCAPE: "Landscape",
  SQUARE: "Square",
  PANORAMIC: "Panoramic",
};

export enum ArtworkAvailability {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
  NOT_FOR_SALE = "NOT_FOR_SALE",
}
export const ArtworkAvailabilityLabels: Record<ArtworkAvailability, string> = {
  [ArtworkAvailability.AVAILABLE]: "Available",
  [ArtworkAvailability.RESERVED]: "Reserved",
  [ArtworkAvailability.SOLD]: "Sold",
  [ArtworkAvailability.NOT_FOR_SALE]: "Not for sale",
};

export interface Artwork {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  year: number | null;

  technique: ArtworkTechnique | null;
  medium: string | null;
  style: ArtworkStyle | null;
  motive: ArtworkMotive | null;
  orientation: ArtworkOrientation | null;
  size: string | null;

  framed: boolean;
  category: ArtworkCategory;
  artistId: number;
  status: ItemStatus;
  availability: ArtworkAvailability;
  artist: {
    name: string;
    slug: string | null;
  };
}

export const CreateArtworkSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  year: z
    .number({
      error: "Year is required",
    })
    .int()
    .min(DEFAULT_MIN_YEAR, {
      message: `Year must be greater than ${DEFAULT_MIN_YEAR}`,
    })
    .max(CURRENT_YEAR, {
      message: "Year cannot be in the future",
    }),

  imageUrl: z
    .string()
    .min(1, "Artwork image is required")
    .url("Must be a valid URL"),

  imagePublicId: z.string().min(1, "Artwork image is required"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description is too long"),

  technique: z.nativeEnum(ArtworkTechnique).optional(),
  medium: z.string().trim().max(200, "Medium is too long").optional(),
  style: z.nativeEnum(ArtworkStyle).optional(),
  motive: z.nativeEnum(ArtworkMotive).optional(),
  orientation: z.nativeEnum(ArtworkOrientation).optional(),
  size: z.string().trim().max(100, "Size is too long").optional(),

  framed: z.boolean(),

  artistId: z
    .number({
      error: "Artist is required",
    })
    .int()
    .positive({ message: "Artist is required" }),

  category: z.nativeEnum(ArtworkCategory, {
    error: "Category is required",
  }),

  status: z.nativeEnum(ItemStatus).default(ItemStatus.DRAFT),

  availability: z
    .nativeEnum(ArtworkAvailability)
    .default(ArtworkAvailability.AVAILABLE),
});

export const UpdateArtworkSchema = CreateArtworkSchema.partial();

export type CreateArtworkDTO = z.infer<typeof CreateArtworkSchema>;
export type UpdateArtworkDTO = z.infer<typeof UpdateArtworkSchema>;
