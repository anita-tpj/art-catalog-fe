"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ArtworkFormLayout } from "@/features/artworks/components/admin/ArtworkFormLayout";
import { useArtwork } from "@/features/artworks/hooks/useArtwork";
import { useUpdateArtwork } from "@/features/artworks/hooks/useUpdateArtwork";
import { useTranslation } from "react-i18next";
import { CreateArtworkDTO, CreateArtworkSchema } from "../../types";

interface EditArtworkPageProps {
  id: number;
}

export const EditArtworkPage = ({ id }: EditArtworkPageProps) => {
  const { t } = useTranslation();
  const { data: artwork, isLoading } = useArtwork(id);
  const updateArtwork = useUpdateArtwork();

  const form = useForm<CreateArtworkDTO>({
    resolver: zodResolver(CreateArtworkSchema),
  });

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (!artwork) return;

    reset({
      title: artwork.title ?? "",
      year: artwork.year ?? undefined,
      imageUrl: artwork.imageUrl ?? undefined,
      imagePublicId: artwork.imagePublicId ?? undefined,
      description: artwork.description ?? "",
      artistId: artwork.artistId,
      category: artwork.category,
      technique: artwork.technique ?? undefined,
      style: artwork.style ?? undefined,
      motive: artwork.motive ?? undefined,
      orientation: artwork.orientation ?? undefined,
      size: artwork.size ?? undefined,
      framed: artwork.framed,
    });
  }, [artwork, reset]);
  console.log("after reset", form.getValues());
  if (isLoading && !artwork) {
    return (
      <p className="text-sm text-zinc-500">{t("Loading artwork details…")}</p>
    );
  }

  if (!artwork) {
    return (
      <p className="text-sm text-red-500">
        {t("Artwork not found or failed to load.")}
      </p>
    );
  }

  const isBusy = isSubmitting || updateArtwork.isPending;
  const apiError = updateArtwork.error
    ? (updateArtwork.error as Error).message
    : undefined;

  return (
    <ArtworkFormLayout
      form={form}
      onSubmit={(data) => updateArtwork.mutate({ id, data })}
      title={t("Edit artwork")}
      subtitle={t("Update artwork details and image.")}
      submitLabel={isBusy ? t("Updating...") : t("Update artwork")}
      isBusy={isBusy}
      apiError={apiError}
    />
  );
};

export default EditArtworkPage;
