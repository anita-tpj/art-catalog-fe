"use client";

import { ArtistFormLayout } from "@/components/admin/artists/ArtistFormLayout";
import { useCreateArtist } from "@/hooks/artists/useCreateArtist";
import { CreateArtistDTO, createArtistSchema } from "@/services/artists";
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
