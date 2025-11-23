import {
  Artwork,
  artworksService,
  CreateArtworkDTO,
} from "@/services/artworks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useUpdateArtwork() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Artwork, Error, { id: number; data: CreateArtworkDTO }>({
    mutationFn: ({ id, data }) => artworksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      router.push("/admin/artworks");
    },
  });
}
