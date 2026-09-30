import { useQuery } from "@tanstack/react-query";
import { artistsService } from "../services/artists";
import { ArtistCmsAccess } from "../types";

export function useArtistCmsAccess(id: number, enabled = true) {
  return useQuery<ArtistCmsAccess>({
    queryKey: ["artists", id, "cms-access"],
    queryFn: () => artistsService.getCmsAccess(id),
    enabled: !!id && enabled,
  });
}