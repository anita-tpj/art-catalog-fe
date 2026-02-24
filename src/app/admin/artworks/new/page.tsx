"use client";

import { ArtworkFormLayout } from "@/features/artworks/components/admin/ArtworkFormLayout";
import { useCreateArtwork } from "@/features/artworks/hooks/useCreateArtwork";
import {
  CreateArtworkDTO,
  CreateArtworkSchema,
} from "@/features/artworks/types";
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
