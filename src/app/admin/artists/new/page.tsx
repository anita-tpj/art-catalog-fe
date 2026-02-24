"use client";

import { ArtistFormLayout } from "@/features/artists/components/admin/ArtistFormLayout";
import { useCreateArtist } from "@/features/artists/hooks/useCreateArtist";
import { CreateArtistDTO, createArtistSchema } from "@/features/artists/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const NewArtistPage = () => {
  const createArtist = useCreateArtist();

  const form = useForm<CreateArtistDTO>({
    resolver: zodResolver(createArtistSchema),
    defaultValues: {
      name: "",
      bio: "",
      country: undefined,
      birthYear: undefined,
      deathYear: undefined,
      avatarUrl: undefined,
      avatarPublicId: undefined,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const isBusy = isSubmitting || createArtist.isPending;
  const apiError = createArtist.error
    ? (createArtist.error as Error).message
    : undefined;

  return (
    <ArtistFormLayout
      form={form}
      onSubmit={(data) => createArtist.mutate(data)}
      title="Create artist"
      subtitle="Add a new artist to the catalog."
      submitLabel={isBusy ? "Saving..." : "Save artist"}
      isBusy={isBusy}
      apiError={apiError}
    />
  );
};

export default NewArtistPage;
