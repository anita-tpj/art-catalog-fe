import { Artist, artistsService } from "@/services/artists";
import { PaginatedResult } from "@/types/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Use for get non paginated artists (change service in that case)

// export function useArtists() {
//   return useQuery<Artist[]>({
//     queryKey: ["artists"],
//     queryFn: artistsService.getAll,
//   });
// }

export function useArtists(page: number, pageSize = 10) {
  return useQuery<PaginatedResult<Artist>, Error>({
    queryKey: ["artworks", { page, pageSize }],
    queryFn: () => artistsService.getAll(page, pageSize),
    placeholderData: keepPreviousData,
  });
}
