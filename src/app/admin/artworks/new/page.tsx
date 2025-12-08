"use client";

import { ArtworkFormLayout } from "@/components/admin/artworks/ArtworkFormLayout";
import { useCreateArtwork } from "@/hooks/artworks/useCreateArtwork";
import { CreateArtworkDTO, CreateArtworkSchema } from "@/services/artworks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function NewArtworkPage() {
  const createArtwork = useCreateArtwork();

  const form = useForm<CreateArtworkDTO>({
    resolver: zodResolver(CreateArtworkSchema),
    defaultValues: {
      title: "",
      year: undefined,
      imageUrl: undefined,
      imagePublicId: undefined,
      description: "",
      category: undefined,
      technique: undefined,
      style: undefined,
      motive: undefined,
      orientation: undefined,
      size: undefined,
      framed: false,
      artistId: undefined as unknown as number,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const isBusy = isSubmitting || createArtwork.isPending;
  const apiError = createArtwork.error
    ? (createArtwork.error as Error).message
    : undefined;

  return (
    <ArtworkFormLayout
      form={form}
      onSubmit={(data) => createArtwork.mutate(data)}
      title="Create artwork"
      subtitle="Add a new artwork to the catalog."
      submitLabel={isBusy ? "Saving..." : "Save artwork"}
      isBusy={isBusy}
      apiError={apiError}
    />
  );
}
