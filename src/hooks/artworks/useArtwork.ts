import { artworksService } from "@/services/artworks";
import { useQuery } from "@tanstack/react-query";

export function useArtwork(id: number) {
  return useQuery({
    queryKey: ["artworks", id],
    queryFn: () => artworksService.getOne(id),
    enabled: !!id,
  });
}
