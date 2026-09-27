export enum ItemStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum ItemVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export const ItemStatusLabels: Record<ItemStatus, string> = {
  [ItemStatus.DRAFT]: "Draft",
  [ItemStatus.PUBLISHED]: "Published",
  [ItemStatus.ARCHIVED]: "Archived",
};

export const ItemVisibilityLabels: Record<ItemVisibility, string> = {
  [ItemVisibility.PUBLIC]: "Public",
  [ItemVisibility.PRIVATE]: "Private",
};