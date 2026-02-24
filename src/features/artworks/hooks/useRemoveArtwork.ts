"use client";

import { showErrorToast } from "@/lib/toast";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { artworksService } from "../services/artworks";
import { Artwork } from "../types";

export function useRemoveArtwork() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<Artwork, Error, number>({
    mutationFn: artworksService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      toast.success("Artwork deleted");
      router.push("/admin/artworks");
    },
    onError: (error) => {
      showErrorToast(error, "Failed to delete artwork");
    },
  });
}
