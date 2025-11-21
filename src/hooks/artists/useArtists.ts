import { Artist, artistsService } from "@/services/artists";
import { useQuery } from "@tanstack/react-query";

export function useArtists() {
  return useQuery<Artist[]>({
    queryKey: ["artists"],
    queryFn: artistsService.getAll,
  });
}
