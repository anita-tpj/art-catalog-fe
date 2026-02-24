"use client";

import { showErrorToast } from "@/lib/toast";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { artworksService } from "../services/artworks";
import { Artwork, CreateArtworkDTO } from "../types";

export function useCreateArtwork() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Artwork, Error, CreateArtworkDTO>({
    mutationFn: artworksService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      toast.success("Artwork updated");
      router.push("/admin/artworks");
    },
    onError: (error) => {
      showErrorToast(error, "Failed to create artwork");
    },
  });
}
