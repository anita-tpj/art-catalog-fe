"use client";

import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useArtworkImageUpload } from "@/hooks/artworks/useArtworkImageUpload";
import Image from "next/image";

type ArtworkImageFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  imgUrl: FieldPath<TFieldValues>;
  imgPublicId: FieldPath<TFieldValues>;
  label?: string;
  buttonLabel?: string;
};

export function AvatarUploadField<TFieldValues extends FieldValues>({
  control,
  setValue,
  imgUrl,
  imgPublicId,
  label = "Artwork image",
  buttonLabel = "Upload image",
}: ArtworkImageFieldProps<TFieldValues>) {
  const imageUrl = useWatch({
    control,
    name: imgUrl,
  }) as string | undefined;

  const {
    uploading,
    error: uploadError,
    handleFileChange,
  } = useArtworkImageUpload({
    onUploaded: ({ url, publicId }) => {
      setValue(imgUrl, url as any, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(imgPublicId, publicId as any, {
        shouldDirty: true,
        shouldValidate: false,
      });
    },
  });

  const inputId = `${String(imgUrl)}-file-input`;

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>

      <Controller
        name={imgUrl}
        control={control}
        render={({ fieldState }) => (
          <div className="flex items-center gap-3 mt-1">
            {/* Circle preview */}
            <div className="h-16 w-16 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 flex items-center justify-center">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Artist avatar"
                  width={64}
                  height={64}
                  className="h-16 w-16 object-cover"
                />
              ) : (
                <span className="text-[10px] text-zinc-400">No avatar</span>
              )}
            </div>
            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <Button
              type="button"
              size="xs"
              className="text-xs mt-1"
              onClick={() => document.getElementById(inputId)?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : buttonLabel}
            </Button>

            <div className="space-y-1 hidden">
              <Label htmlFor={`${imgUrl}-hidden`}>Image URL (Cloudinary)</Label>
              <Input id={`${imgUrl}-hidden`} readOnly value={imageUrl ?? ""} />
            </div>

            {uploadError && (
              <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}
            {fieldState.error && (
              <p className="text-xs text-red-500 mt-1">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
