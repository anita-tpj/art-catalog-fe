import { Artist, artistsService, CreateArtistDTO } from "@/services/artists";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useCreateArtist() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Artist, Error, CreateArtistDTO>({
    mutationFn: artistsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      router.push("/admin/artists");
    },
  });
}
