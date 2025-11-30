import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Artwork, artworksService } from "@/services/artworks";
import { PaginatedResult, PaginatedRequest } from "@/types/api";

const ARTWorks_QUERY_KEY = "artworks";

export function useArtworks(params: PaginatedRequest) {
  return useQuery<PaginatedResult<Artwork>>({
    queryKey: [ARTWorks_QUERY_KEY, params],
    queryFn: () => artworksService.getAll(params),
    placeholderData: keepPreviousData,
  });
}
