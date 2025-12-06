"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useArtworkImageUpload } from "@/hooks/artworks/useArtworkImageUpload";
import { useCreateArtwork } from "@/hooks/artworks/useCreateArtwork";
import { CreateArtworkDTO, CreateArtworkSchema } from "@/services/artworks";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";

export default function NewArtworkPage() {
  const createArtwork = useCreateArtwork();

  const {
    register,
    handleSubmit,
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

  const onSubmit = (data: CreateArtworkDTO) => {
    createArtwork.mutate(data);
  };

  const isBusy = isSubmitting || createArtwork.isPending || uploading;

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

          {/* Image upload (Cloudinary) */}
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
              size="xs"
              className="text-xs ml-5"
              onClick={() => document.getElementById("imageFile")?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload image"}
            </Button>

            {uploadError && (
              <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}

            {imageUrl && (
              <p className="text-xs text-green-600">Image uploaded ✓</p>
            )}
          </div>
          <div className="space-y-1 hidden">
            <Label htmlFor="imageUrl">Image URL (Cloudinary)</Label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="https://..."
              readOnly
            />
            {errors.imageUrl && (
              <p className="text-xs text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Image preview */}
          {imageUrl && (
            <div className="space-y-1">
              <p className="mb-1 text-xs text-zinc-500">Preview:</p>
              <Image
                src={imageUrl}
                alt="Artwork preview"
                width={400}
                height={400}
                className="h-40 w-auto object-contain border border-zinc-200 p-1"
              />
            </div>
          )}

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
