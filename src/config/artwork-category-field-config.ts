import { ArtworkCategory } from "@/features/artworks/types";

export type ArtworkFieldKey =
  | "technique"
  | "medium"
  | "style"
  | "motive"
  | "orientation"
  | "size"
  | "framed";

export type CategoryFieldConfig = {
  visible: ArtworkFieldKey[];
  required: ArtworkFieldKey[];
};

export const CATEGORY_FIELD_CONFIG: Record<
  ArtworkCategory,
  CategoryFieldConfig
> = {
  [ArtworkCategory.PAINTING]: {
    visible: [
      "medium",
      "technique",
      "style",
      "motive",
      "orientation",
      "size",
      "framed",
    ],
    required: [],
  },
  [ArtworkCategory.SCULPTURE]: {
    visible: ["medium", "style", "size"],
    required: [],
  },
  [ArtworkCategory.PHOTOGRAPHY]: {
    visible: ["medium", "style", "motive", "orientation", "size"],
    required: [],
  },
  [ArtworkCategory.DRAWING_ILLUSTRATION]: {
    visible: [
      "medium",
      "technique",
      "style",
      "motive",
      "orientation",
      "size",
      "framed",
    ],
    required: [],
  },
  [ArtworkCategory.PRINTMAKING]: {
    visible: [
      "medium",
      "technique",
      "style",
      "motive",
      "orientation",
      "size",
      "framed",
    ],
    required: [],
  },
  [ArtworkCategory.DIGITAL_ART]: {
    visible: ["medium", "style", "motive", "orientation", "size"],
    required: [],
  },
  [ArtworkCategory.MIXED_MEDIA]: {
    visible: [
      "medium",
      "technique",
      "style",
      "motive",
      "orientation",
      "size",
      "framed",
    ],
    required: [],
  },
  [ArtworkCategory.TEXTILE_FIBER_ART]: {
    visible: [],
    required: [],
  },
  [ArtworkCategory.CERAMICS]: {
    visible: [],
    required: [],
  },
  [ArtworkCategory.OTHER]: {
    visible: ["medium", "technique", "style", "motive", "orientation", "size"],
    required: [],
  },
};
