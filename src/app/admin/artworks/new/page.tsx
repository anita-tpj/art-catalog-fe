"use client";

import { CreateArtworkDTO, CreateArtworkSchema } from "@/services/artworks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateArtwork } from "@/hooks/artworks/useCreateArtwork";

export default function NewArtworkPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateArtworkDTO>({
    resolver: zodResolver(CreateArtworkSchema),
    defaultValues: {
      title: "",
      year: undefined,
      imageUrl: "",
      description: "",
      category: "OTHER",
    },
  });

  const createArtwork = useCreateArtwork();

  const onSubmit = (data: CreateArtworkDTO) => {
    createArtwork.mutate(data);
  };

  const isBusy = isSubmitting || createArtwork.isPending;

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Create artwork</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Add a new artwork to the catalog.
      </p>

      <Card className="border border-dashed border-zinc-300 p-4 text-sm dark:border-zinc-700">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="Type title" />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Year */}
          <div className="space-y-1">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              {...register("year", { valueAsNumber: true })}
              placeholder="Type year (optional)"
            />
            {errors.year && (
              <p className="text-xs text-red-500">{errors.year.message}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="https://..."
            />
            {errors.imageUrl && (
              <p className="text-xs text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="Type description"
              rows={4}
              className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* Artist */}
          <div className="space-y-1">
            <Label htmlFor="artistId">Artist ID</Label>
            <Input
              id="artistId"
              type="number"
              {...register("artistId", { valueAsNumber: true })}
              placeholder="Enter artist ID"
            />
            {errors.artistId && (
              <p className="text-xs text-red-500">{errors.artistId.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              {...register("category")}
              className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="PAINTING">Painting</option>
              <option value="SCULPTURE">Sculpture</option>
              <option value="DIGITAL">Digital</option>
              <option value="PHOTOGRAPHY">Photography</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.category && (
              <p className="text-xs text-red-500">{errors.category.message}</p>
            )}
          </div>

          {createArtwork.error && (
            <p className="text-xs text-red-500">
              {(createArtwork.error as Error).message ??
                "Failed to save artwork."}
            </p>
          )}

          <div className="pt-2">
            <Button type="submit" disabled={isBusy}>
              {isBusy ? "Saving..." : "Save artwork"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
