"use client";

import { showErrorToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { artistsService } from "../services/artists";

export function useRevokeArtistCmsInvitation(id: number) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (invitationId: string) =>
      artistsService.revokeCmsInvitation(id, invitationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["artists", id, "cms-access"],
      });

      toast.success(t("Invitation revoked"));
    },

    onError: (error) => {
      showErrorToast(error, t("Failed to revoke invitation"));
    },
  });
}
