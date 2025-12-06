"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CountrySelect } from "@/components/ui/country-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateArtist } from "@/hooks/artists/useCreateArtist";
import { CreateArtistDTO, createArtistSchema } from "@/services/artists";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useArtistAvatarUpload } from "@/hooks/artists/useArtistAvatarUpload";
import Image from "next/image";

const NewArtistPage = () => {
  const createArtist = useCreateArtist();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateArtistDTO>({
    resolver: zodResolver(createArtistSchema) as Resolver<CreateArtistDTO>,
    defaultValues: {
      name: "",
      bio: "",
      country: "",
      birthYear: undefined,
      deathYear: undefined,
      avatarUrl: undefined,
      avatarPublicId: undefined,
    },
  });

  const avatarUrl = watch("avatarUrl");

  const {
    uploading: avatarUploading,
    error: avatarError,
    handleFileChange: handleAvatarChange,
  } = useArtistAvatarUpload({
    onUploaded: ({ url, publicId }) => {
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
    createArtist.mutate(data);
  };

  const isBusy = isSubmitting || createArtist.isPending || avatarUploading;

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Create artist</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Add a new artist to the catalog.
      </p>

      <Card className="border border-dashed border-zinc-300 p-4 text-sm dark:border-zinc-700">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar upload */}
          <div className="space-y-2">
            <Label htmlFor="avatarFile">Artist avatar</Label>

            <div className="flex items-center gap-3 mt-1">
              {/* Circle preview */}
              <div className="h-16 w-16 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 flex items-center justify-center">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Artist avatar"
                    width={64}
                    height={64}
                    className="h-16 w-16 object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-zinc-400">No avatar</span>
                )}
              </div>
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
                  className="text-xs"
                  variant="outline"
                  onClick={() => document.getElementById("avatarFile")?.click()}
                  disabled={avatarUploading}
                >
                  {avatarUploading ? "Uploading..." : "Upload avatar"}
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

          {createArtist.error && (
            <p className="text-xs text-red-500">
              {(createArtist.error as Error).message ??
                "Failed to save artist."}
            </p>
          )}

          <div className="pt-2">
            <Button type="submit" disabled={isBusy}>
              {isBusy ? "Saving..." : "Save artist"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default NewArtistPage;
