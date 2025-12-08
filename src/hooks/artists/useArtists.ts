import { Artist, artistsService } from "@/services/artists";
import { PaginatedRequest, PaginatedResult } from "@/types/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const ARTISTS_QUERY_KEY = "artists";

export function useArtists() {
  return useQuery<Artist[]>({
    queryKey: [ARTISTS_QUERY_KEY, "options"],
    queryFn: artistsService.getAll,
  });
}

export function usePaginatedArtists(params: PaginatedRequest) {
  return useQuery<PaginatedResult<Artist>>({
    queryKey: [ARTISTS_QUERY_KEY, params],
    queryFn: () => artistsService.getPaginated(params),
    placeholderData: keepPreviousData,
  });
}
