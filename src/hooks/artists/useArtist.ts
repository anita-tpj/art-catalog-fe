import { useQuery } from "@tanstack/react-query";
import { artistsService, Artist } from "@/services/artists";

export function useArtist(id: number) {
  return useQuery<Artist>({
    queryKey: ["artists", id],
    queryFn: () => artistsService.getOne(id),
    enabled: !!id,
  });
}
