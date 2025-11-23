import { showErrorToast } from "@/lib/toast";
import { Artist, artistsService, CreateArtistDTO } from "@/services/artists";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useUpdateArtist() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Artist, Error, { id: number; data: CreateArtistDTO }>({
    mutationFn: ({ id, data }) => artistsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      toast.success("Artist updated");
      router.push("/admin/artists");
    },
    onError: (error) => {
      showErrorToast(error, "Failed to update artist");
    },
  });
}
