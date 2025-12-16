import { del, get, getById, post, put } from "@/lib/api-client";
import { CURRENT_YEAR, DEFAULT_MIN_YEAR } from "@/lib/year-options";
import { PaginatedRequest, PaginatedResult } from "@/types/api";
import { z } from "zod";

export enum ArtworkCategory {
  PAINTING = "PAINTING",
  SCULPTURE = "SCULPTURE",
  DIGITAL = "DIGITAL",
  PHOTOGRAPHY = "PHOTOGRAPHY",
  OTHER = "OTHER",
}

export const ArtworkCategoryLabels: Record<ArtworkCategory, string> = {
  PAINTING: "Painting",
  SCULPTURE: "Sculpture",
  DIGITAL: "Digital",
  PHOTOGRAPHY: "Photography",
  OTHER: "Other",
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

export enum ArtworkStandardSize {
  SIZE_30x40 = "SIZE_30x40",
  SIZE_40x50 = "SIZE_40x50",
  SIZE_50x70 = "SIZE_50x70",
  SIZE_60x80 = "SIZE_60x80",
  SIZE_70x100 = "SIZE_70x100",
  A4_21x29_7 = "A4_21x29_7",
  A3_29_7x42 = "A3_29_7x42",
  A2_42x59_4 = "A2_42x59_4",
  CUSTOM = "CUSTOM",
}

export const ArtworkStandardSizeLabels: Record<ArtworkStandardSize, string> = {
  SIZE_30x40: "30 x 40 cm",
  SIZE_40x50: "40 x 50 cm",
  SIZE_50x70: "50 x 70 cm",
  SIZE_60x80: "60 x 80 cm",
  SIZE_70x100: "70 x 100 cm",
  A4_21x29_7: "A4 (21 x 29.7 cm)",
  A3_29_7x42: "A3 (29.7 x 42 cm)",
  A2_42x59_4: "A2 (42 x 59.4 cm)",
  CUSTOM: "Custom size",
};

export interface Artwork {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  year: number | null;

  technique: ArtworkTechnique | null;
  style: ArtworkStyle | null;
  motive: ArtworkMotive | null;
  orientation: ArtworkOrientation | null;
  size: ArtworkStandardSize | null;

  framed: boolean;
  category: ArtworkCategory;
  artistId: number;
  artist: {
    name: string;
  };
}

export const CreateArtworkSchema = z.object({
  title: z.string().min(1, "Title is required"),

  year: z
    .number()
    .int()
    .min(DEFAULT_MIN_YEAR, {
      message: `Year must be greater than ${DEFAULT_MIN_YEAR}`,
    })
    .max(CURRENT_YEAR, {
      message: "Year cannot be in the future",
    })
    .optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  imagePublicId: z.string().optional(),
  description: z.string().max(2000, "Description is too long").optional(),
  technique: z.nativeEnum(ArtworkTechnique).optional(),
  style: z.nativeEnum(ArtworkStyle).optional(),
  motive: z.nativeEnum(ArtworkMotive).optional(),
  orientation: z.nativeEnum(ArtworkOrientation).optional(),
  size: z.nativeEnum(ArtworkStandardSize).optional(),
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
});

export const UpdateArtworkSchema = CreateArtworkSchema.partial();

export type CreateArtworkDTO = z.infer<typeof CreateArtworkSchema>;
export type UpdateArtworkDTO = z.infer<typeof UpdateArtworkSchema>;

export const artworksService = {
  getAll: () => get<Artwork[]>("/api/artworks/all"),
  //getById: (id: number) => get<Artwork>(`/api/artworks/${id}`),
  getPaginated: ({ page, pageSize, search }: PaginatedRequest) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (search && search.trim() !== "") {
      params.set("search", search.trim());
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
