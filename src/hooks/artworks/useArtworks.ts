import { Artwork, artworksService } from "@/services/artworks";
import { PaginatedRequest, PaginatedResult } from "@/types/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const ARTWORKS_QUERY_KEY = "artworks";

export function useArtworks() {
  return useQuery<Artwork[]>({
    queryKey: [ARTWORKS_QUERY_KEY, "options"],
    queryFn: artworksService.getAll,
  });
}

export function usePaginatedArtworks(params: PaginatedRequest) {
  return useQuery<PaginatedResult<Artwork>>({
    queryKey: [ARTWORKS_QUERY_KEY, params],
    queryFn: () => artworksService.getPaginated(params),
    placeholderData: keepPreviousData,
  });
}
