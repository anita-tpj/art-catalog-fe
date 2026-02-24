"use client";

import { showErrorToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { artistsService } from "../services/artists";
import { Artist, CreateArtistDTO } from "../types";

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
