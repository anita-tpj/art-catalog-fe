"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ArtworkFormLayout } from "@/components/admin/artworks/ArtworkFormLayout";
import { useArtwork } from "@/hooks/artworks/useArtwork";
import { useUpdateArtwork } from "@/hooks/artworks/useUpdateArtwork";
import { CreateArtworkDTO, CreateArtworkSchema } from "@/services/artworks";

interface EditArtworkPageProps {
  id: number;
}

const EditArtworkPage = ({ id }: EditArtworkPageProps) => {
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
    return <p className="text-sm text-zinc-500">Loading artwork details…</p>;
  }

  if (!artwork) {
    return (
      <p className="text-sm text-red-500">
        Artwork not found or failed to load.
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
      title="Edit artwork"
      subtitle="Update artwork details and image."
      submitLabel={isBusy ? "Updating..." : "Update artwork"}
      isBusy={isBusy}
      apiError={apiError}
    />
  );
};

export default EditArtworkPage;
