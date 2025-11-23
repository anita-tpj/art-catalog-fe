"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/ui/country-select";
import { useArtist } from "@/hooks/artists/useArtist";
import { useUpdateArtist } from "@/hooks/artists/useUpdateArtist";
import { CreateArtistDTO, createArtistSchema } from "@/services/artists";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Resolver, useForm, Controller } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";

interface EditArtistPageProps {
  id: number;
}

const EditArtistPage = ({ id }: EditArtistPageProps) => {
  const { data: artist, isLoading } = useArtist(id);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateArtistDTO>({
    resolver: zodResolver(createArtistSchema) as Resolver<CreateArtistDTO>,
    defaultValues: {
      name: "",
      country: "",
      bio: "",
    },
  });

  const updateArtist = useUpdateArtist();

  const onSubmit = (data: CreateArtistDTO) => {
    updateArtist.mutate({ id, data });
  };

  const isBusy = isSubmitting || updateArtist.isPending;

  useEffect(() => {
    if (!artist) return;

    reset({
      name: artist.name ?? "",
      country: artist.country ?? "",
      bio: artist.bio ?? "",
      birthYear: artist.birthYear ?? undefined,
      deathYear: artist.deathYear ?? undefined,
    });
  }, [artist, reset]);

  if (isLoading && !artist) {
    return <p className="text-sm text-zinc-500">Loading artist details…</p>;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Create artist</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Add a new artist to the catalog.
      </p>

      <Card className="border border-dashed border-zinc-300 p-4 text-sm dark:border-zinc-700">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
