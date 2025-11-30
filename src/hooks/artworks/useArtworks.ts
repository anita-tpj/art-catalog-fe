import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Artwork, artworksService } from "@/services/artworks";
import { PaginatedResult } from "@/types/api";

export function useArtworks(page: number, pageSize = 10) {
  return useQuery<PaginatedResult<Artwork>, Error>({
    queryKey: ["artworks", { page, pageSize }],
    queryFn: () => artworksService.getAll(page, pageSize),
    placeholderData: keepPreviousData,
  });
}
