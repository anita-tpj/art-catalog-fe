import { useQuery } from "@tanstack/react-query";
import { artworksService } from "../services/artworks";

export function useArtwork(id: number) {
  return useQuery({
    queryKey: ["artworks", id],
    queryFn: () => artworksService.getOne(id),
    enabled: !!id,
  });
}
