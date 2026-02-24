import { ArtworkCategory } from "@/features/artworks/types";

export type ArtworkFieldKey =
  | "technique"
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
    visible: ["technique", "style", "motive", "orientation", "size", "framed"],
    required: ["technique", "orientation"],
  },
  [ArtworkCategory.SCULPTURE]: {
    visible: ["technique", "style", "framed"],
    required: [],
  },
  [ArtworkCategory.PHOTOGRAPHY]: {
    visible: ["technique", "style", "motive", "orientation", "size", "framed"],
    required: ["orientation"],
  },
  [ArtworkCategory.DRAWING_ILLUSTRATION]: {
    visible: ["technique", "style", "motive", "orientation", "size", "framed"],
    required: ["technique", "orientation"],
  },
  [ArtworkCategory.PRINTMAKING]: {
    visible: ["technique", "style", "motive", "orientation", "size", "framed"],
    required: ["technique", "orientation"],
  },
  [ArtworkCategory.DIGITAL_ART]: {
    visible: ["technique", "style", "motive", "orientation"],
    required: [],
  },
  [ArtworkCategory.MIXED_MEDIA]: {
    visible: ["technique", "style", "motive", "orientation", "size", "framed"],
    required: [],
  },
  [ArtworkCategory.TEXTILE_FIBER_ART]: {
    visible: ["technique", "style", "motive", "orientation", "size", "framed"],
    required: [],
  },
  [ArtworkCategory.CERAMICS]: {
    visible: ["technique", "style", "size", "framed"],
    required: [],
  },
  [ArtworkCategory.OTHER]: {
    visible: ["technique", "style", "motive", "orientation", "framed"],
    required: [],
  },
};
