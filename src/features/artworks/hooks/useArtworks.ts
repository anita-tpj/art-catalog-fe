import { PaginatedRequest, PaginatedResult } from "@/types/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { artworksService } from "../services/artworks";
import { Artwork } from "../types";

const ARTWORKS_QUERY_KEY = "artworks";

export function useArtworks() {
  return useQuery<Artwork[]>({
    queryKey: [ARTWORKS_QUERY_KEY, "options"],
    queryFn: artworksService.getAll,
  });
}

export function usePaginatedArtworks(params: PaginatedRequest) {
  return useQuery<PaginatedResult<Artwork>>({
    queryKey: [ARTWORKS_QUERY_KEY, "admin", params],
    queryFn: () => artworksService.getPaginated(params),
    placeholderData: keepPreviousData,
  });
}

export function usePublishedArtworks() {
  return useQuery<Artwork[]>({
    queryKey: [ARTWORKS_QUERY_KEY, "public", "options"],
    queryFn: artworksService.getAllPublished,
  });
}

export function usePaginatedPublishedArtworks(params: PaginatedRequest) {
  return useQuery<PaginatedResult<Artwork>>({
    queryKey: [ARTWORKS_QUERY_KEY, "public", params],
    queryFn: () => artworksService.getPaginatedPublished(params),
    placeholderData: keepPreviousData,
  });
}
