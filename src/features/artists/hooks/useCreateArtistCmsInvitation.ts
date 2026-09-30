"use client";

import { showErrorToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { artistsService } from "../services/artists";
import { CreateArtistCmsInvitationDTO } from "../types";

export function useCreateArtistCmsInvitation(id: number) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateArtistCmsInvitationDTO) =>
      artistsService.createCmsInvitation(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["artists", id, "cms-access"],
      });

      toast.success(t("Invitation created"));
    },

    onError: (error) => {
      showErrorToast(error, t("Failed to create invitation"));
    },
  });
}