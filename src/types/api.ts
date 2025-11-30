export interface PaginationMeta {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
