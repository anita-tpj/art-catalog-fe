"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/ui/country-select";
import { useArtist } from "@/hooks/artists/useArtist";
import { useUpdateArtist } from "@/hooks/artists/useUpdateArtist";
import { useArtistAvatarUpload } from "@/hooks/artists/useArtistAvatarUpload";
import { CreateArtistDTO, createArtistSchema } from "@/services/artists";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Resolver, useForm, Controller } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

interface EditArtistPageProps {
  id: number;
}

const EditArtistPage = ({ id }: EditArtistPageProps) => {
  const { data: artist, isLoading } = useArtist(id);
  const updateArtist = useUpdateArtist();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateArtistDTO>({
    resolver: zodResolver(createArtistSchema) as Resolver<CreateArtistDTO>,
    defaultValues: {
      name: "",
      country: "",
      bio: "",
      birthYear: undefined,
      deathYear: undefined,
      avatarUrl: undefined,
      avatarPublicId: undefined,
    },
  });

  // Watch current avatar URL for preview
  const avatarUrl = watch("avatarUrl");

  const {
    uploading: avatarUploading,
    error: avatarError,
    handleFileChange: handleAvatarChange,
  } = useArtistAvatarUpload({
    onUploaded: ({ url, publicId }) => {
      // Update form values when new avatar is uploaded
      setValue("avatarUrl", url, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("avatarPublicId", publicId, {
        shouldDirty: true,
        shouldValidate: false,
      });
    },
  });

  const onSubmit = (data: CreateArtistDTO) => {
    updateArtist.mutate({ id, data });
  };

  const isBusy = isSubmitting || updateArtist.isPending || avatarUploading;

  // Populate form when artist data is loaded
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

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Edit artist</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Update artist details and avatar.
      </p>

      <Card className="border border-dashed border-zinc-300 p-4 text-sm dark:border-zinc-700">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar upload */}
          <div className="space-y-2">
            <Label htmlFor="avatarFile">Artist avatar</Label>

            <div className="flex items-center gap-3">
              {/* Circular preview */}
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={artist.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-zinc-400">No avatar</span>
                )}
              </div>

              {/* Hidden file input + button */}
              <div>
                <input
                  id="avatarFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  onClick={() => document.getElementById("avatarFile")?.click()}
                  disabled={avatarUploading}
                >
                  {avatarUploading ? "Uploading..." : "Replace avatar"}
                </Button>

                {avatarError && (
                  <p className="mt-1 text-xs text-red-500">{avatarError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} placeholder="Type name" />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Birth Year */}
          <div className="space-y-1">
            <Label htmlFor="birthYear">Year of birth</Label>
            <Input
              id="birthYear"
              type="number"
              {...register("birthYear")}
              placeholder="Type year (optional)"
            />
            {errors.birthYear && (
              <p className="text-xs text-red-500">{errors.birthYear.message}</p>
            )}
          </div>

          {/* Death Year */}
          <div className="space-y-1">
            <Label htmlFor="deathYear">Year of death</Label>
            <Input
              id="deathYear"
              type="number"
              {...register("deathYear")}
              placeholder="Type year (optional)"
            />
            {errors.deathYear && (
              <p className="text-xs text-red-500">{errors.deathYear.message}</p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-1">
            <Label htmlFor="country">Country</Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <CountrySelect
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors.country?.message}
                />
              )}
            />
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              {...register("bio")}
              placeholder="Type bio"
              rows={4}
              className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            {errors.bio && (
              <p className="text-xs text-red-500">{errors.bio.message}</p>
            )}
          </div>

          {updateArtist.error && (
            <p className="text-xs text-red-500">
              {(updateArtist.error as Error).message ??
                "Failed to update artist."}
            </p>
          )}

          <div className="pt-2">
            <Button type="submit" disabled={isBusy}>
              {isBusy && <Spinner size="sm" className="mr-2" />}
              {isBusy ? "Updating..." : "Update artist"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default EditArtistPage;
