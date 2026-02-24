import { useQuery } from "@tanstack/react-query";
import { artistsService } from "../services/artists";
import { Artist } from "../types";

export function useArtist(id: number) {
  return useQuery<Artist>({
    queryKey: ["artists", id],
    queryFn: () => artistsService.getOne(id),
    enabled: !!id,
  });
}
