"use client";

import { ArtistFormLayout } from "@/components/admin/artists/ArtistFormLayout";
import { useArtist } from "@/hooks/artists/useArtist";
import { useUpdateArtist } from "@/hooks/artists/useUpdateArtist";
import { CreateArtistDTO, createArtistSchema } from "@/services/artists";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";

interface EditArtistPageProps {
  id: number;
}

const EditArtistPage = ({ id }: EditArtistPageProps) => {
  const { data: artist, isLoading } = useArtist(id);
  const updateArtist = useUpdateArtist();

  const form = useForm<CreateArtistDTO>({
    resolver: zodResolver(createArtistSchema) as Resolver<CreateArtistDTO>,
  });

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (!artist) return;

    reset({
      name: artist.name ?? "",
      country: artist.country ?? "",
      bio: artist.bio ?? "",
      birthYear: artist.birthYear ?? undefined,
      deathYear: artist.deathYear ?? undefined,
      avatarUrl: artist.avatarUrl ?? undefined,
      avatarPublicId: artist.avatarPublicId ?? undefined,
      primaryCategory: artist.primaryCategory ?? undefined,
    });
  }, [artist, reset]);

  if (isLoading && !artist) {
    return <p className="text-sm text-zinc-500">Loading artist details…</p>;
  }

  if (!artist) {
    return (
      <p className="text-sm text-red-500">
        Artist not found or failed to load.
      </p>
    );
  }

  const isBusy = isSubmitting || updateArtist.isPending;
  const apiError = updateArtist.error
    ? (updateArtist.error as Error).message
    : undefined;

  return (
    <ArtistFormLayout
      form={form}
      onSubmit={(data) => updateArtist.mutate({ id, data })}
      title="Edit artist"
      subtitle="Update artist details."
      submitLabel={isBusy ? "Updating..." : "Update artist"}
      isBusy={isBusy}
      apiError={apiError}
    />
  );
};

export default EditArtistPage;
