"use client";

import { useQuery } from "@tanstack/react-query";
import { Artwork, artworksService } from "@/services/artworks";

export function useArtworks() {
  return useQuery<Artwork[]>({
    queryKey: ["artworks"],
    queryFn: () => artworksService.getAll(),
  });
}
