"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useArtwork } from "@/hooks/artworks/useArtwork";
import { useArtworkImageUpload } from "@/hooks/artworks/useArtworkImageUpload";
import { useUpdateArtwork } from "@/hooks/artworks/useUpdateArtwork";
import { CreateArtworkDTO, CreateArtworkSchema } from "@/services/artworks";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EditArtworkPageProps {
  id: number;
}

const EditArtworkPage = ({ id }: EditArtworkPageProps) => {
  const { data: artwork, isLoading } = useArtwork(id);
  const updateArtwork = useUpdateArtwork();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateArtworkDTO>({
    resolver: zodResolver(CreateArtworkSchema),
    defaultValues: {
      title: "",
      year: undefined,
      imageUrl: undefined,
      imagePublicId: undefined,
      description: "",
      artistId: undefined as unknown as number,
      category: "OTHER",
    },
  });

  const imageUrl = watch("imageUrl");

  const {
    uploading,
    error: uploadError,
    handleFileChange,
  } = useArtworkImageUpload({
    onUploaded: ({ url, publicId }) => {
      setValue("imageUrl", url, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("imagePublicId", publicId, {
        shouldDirty: true,
        shouldValidate: false,
      });
    },
  });

  useEffect(() => {
    if (!artwork) return;

    reset({
      title: artwork.title ?? "",
      year: artwork.year ?? undefined,
      imageUrl: artwork.imageUrl ?? undefined,
      imagePublicId: artwork.imagePublicId ?? undefined,
      description: artwork.description ?? "",
      artistId: artwork.artistId,
      category: artwork.category ?? "OTHER",
    });
  }, [artwork, reset]);

  const onSubmit = (data: CreateArtworkDTO) => {
    updateArtwork.mutate({ data, id });
  };

  const isBusy = isSubmitting || updateArtwork.isPending || uploading;

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

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Edit artwork</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Update artwork details and image.
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

          {/* Image upload + preview (Cloudinary) */}
          <div className="space-y-1">
            <Label htmlFor="imageFile">Artwork image</Label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <Button
              type="button"
              variant="outline"
              size="xs"
              className="text-xs ml-5"
              onClick={() => document.getElementById("imageFile")?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Replace image"}
            </Button>
            {uploadError && (
              <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}
            <div className="space-y-1 hidden">
              <Label htmlFor="imageUrl">Image URL (Cloudinary)</Label>
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="https://..."
                readOnly
              />
              {errors.imageUrl && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {/* Image preview */}
            {imageUrl && (
              <div className="space-y-1">
                <p className="mb-1 text-xs text-zinc-500">Preview:</p>
                <div className="relative h-40 w-full max-w-xs">
                  <Image
                    src={imageUrl}
                    alt="Artwork preview"
                    width={400}
                    height={400}
                    className="h-40 w-auto object-contain border border-zinc-200 p-1"
                  />
                </div>
              </div>
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

          {updateArtwork.error && (
            <p className="text-xs text-red-500">
              {(updateArtwork.error as Error).message ??
                "Failed to save artwork."}
            </p>
          )}

          <div className="pt-2">
            <Button type="submit" disabled={isBusy}>
              {isBusy && <Spinner size="sm" className="mr-2" />}
              {isBusy ? "Updating..." : "Update artwork"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default EditArtworkPage;
