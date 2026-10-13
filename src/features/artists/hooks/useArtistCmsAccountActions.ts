import { useMutation, useQueryClient } from "@tanstack/react-query";
import { artistsService } from "../services/artists";

export function useArtistCmsAccountActions(artistId: number) {
  const queryClient = useQueryClient();

  const invalidateAccess = () =>
    queryClient.invalidateQueries({
      queryKey: ["artists", artistId, "cms-access"],
    });

  const deactivate = useMutation({
    mutationFn: (userId: string) =>
      artistsService.deactivateCmsAccount(userId),
    onSuccess: invalidateAccess,
  });

  const activate = useMutation({
    mutationFn: (userId: string) =>
      artistsService.activateCmsAccount(userId),
    onSuccess: invalidateAccess,
  });

  const remove = useMutation({
    mutationFn: (userId: string) =>
      artistsService.deleteCmsAccount(userId),
    onSuccess: invalidateAccess,
  });

  return {
    deactivate,
    activate,
    remove,
  };
}