import { Artist, artistsService, CreateArtistDTO } from "@/services/artists";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useUpdateArtist() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Artist, Error, { id: number; data: CreateArtistDTO }>({
    mutationFn: ({ id, data }) => artistsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      router.push("/admin/artists");
    },
  });
}
