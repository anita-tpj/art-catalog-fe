import {
  Artwork,
  CreateArtworkDTO,
  artworksService,
} from "@/services/artworks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useCreateArtwork() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Artwork, Error, CreateArtworkDTO>({
    mutationFn: artworksService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      router.push("/admin/artworks");
    },
  });
}
