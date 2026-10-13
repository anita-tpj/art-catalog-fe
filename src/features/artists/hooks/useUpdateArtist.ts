"use client";

import { showErrorToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { artistsService } from "../services/artists";
import { Artist, UpdateArtistDTO } from "../types";

interface UseUpdateArtistOptions {
  redirectOnSuccess?: boolean;
}

export function useUpdateArtist({
  redirectOnSuccess = true,
}: UseUpdateArtistOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation<Artist, Error, { id: number; data: UpdateArtistDTO }>({
    mutationFn: ({ id, data }) => artistsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });

      toast.success(t("Artist updated"));

      if (redirectOnSuccess) {
        router.push("/admin/artists");
      }
    },
    onError: (error) => {
      showErrorToast(error, t("Failed to update artist"));
    },
  });
}
