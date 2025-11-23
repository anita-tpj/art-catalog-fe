import { showErrorToast } from "@/lib/toast";
import {
  Artwork,
  artworksService,
  CreateArtworkDTO,
} from "@/services/artworks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useUpdateArtwork() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Artwork, Error, { id: number; data: CreateArtworkDTO }>({
    mutationFn: ({ id, data }) => artworksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      toast.success("Artwork updated");
      router.push("/admin/artworks");
    },
    onError: (error) => {
      showErrorToast(error, "Failed to update artwork");
    },
  });
}
