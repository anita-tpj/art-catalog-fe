import { Artwork, artworksService } from "@/services/artworks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useRemoveArtwork() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<Artwork, Error, number>({
    mutationFn: artworksService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      router.push("/admin/artworks");
    },
  });
}
