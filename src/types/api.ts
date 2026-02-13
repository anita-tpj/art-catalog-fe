export interface PaginationMeta {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface PaginatedRequest {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  artistId?: number;
  primaryCategory?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

