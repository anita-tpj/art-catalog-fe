"use client";

import { showErrorToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { artistsService } from "../services/artists";
import { Artist } from "../types";

export function useRemoveArtist() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Artist, Error, number>({
    mutationFn: artistsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      toast.success("Artist deleted");
      router.push("/admin/artists");
    },
    onError: (error) => {
      showErrorToast(error, "Failed to delete artist");
    },
  });
}
