import { showErrorToast } from "@/lib/toast";
import { Artist, artistsService, CreateArtistDTO } from "@/services/artists";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useCreateArtist() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Artist, Error, CreateArtistDTO>({
    mutationFn: artistsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      toast.success("Artist updated");
      router.push("/admin/artists");
    },
    onError: (error) => {
      showErrorToast(error, "Failed create artist");
    },
  });
}
