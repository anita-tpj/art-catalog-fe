"use client";

import { showErrorToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { artistsService } from "../services/artists";
import { Artist } from "../types";

export function useRemoveArtist() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation<Artist, Error, number>({
    mutationFn: artistsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      toast.success(t("Artist deleted"));
      router.push("/admin/artists");
    },
    onError: (error) => {
      showErrorToast(error, t("Failed to delete artist"));
    },
  });
}
