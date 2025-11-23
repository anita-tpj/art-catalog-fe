import { Artist, artistsService } from "@/services/artists";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useRemoveArtist() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Artist, Error, number>({
    mutationFn: artistsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      router.push("/admin/artists");
    },
  });
}
