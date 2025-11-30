import { Artist, artistsService } from "@/services/artists";
import { PaginatedResult, PaginatedRequest } from "@/types/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Use for get non paginated artists (change service in that case)

// export function useArtists() {
//   return useQuery<Artist[]>({
//     queryKey: ["artists"],
//     queryFn: artistsService.getAll,
//   });
// }

const ARTISTS_QUERY_KEY = "artists";

export function useArtists(params: PaginatedRequest) {
  return useQuery<PaginatedResult<Artist>>({
    queryKey: [ARTISTS_QUERY_KEY, params],
    queryFn: () => artistsService.getAll(params),
    placeholderData: keepPreviousData,
  });
}
