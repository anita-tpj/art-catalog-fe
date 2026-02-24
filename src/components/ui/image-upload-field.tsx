"use client";

import { Button } from "@/components/ui";
import { Label } from "@/components/ui";
import clsx from "clsx";
import Image from "next/image";
import { useId, useMemo } from "react";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";

export type UploadedImage = { url: string; publicId: string };

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;

  imgUrl: FieldPath<TFieldValues>;
  imgPublicId: FieldPath<TFieldValues>;

  label?: string;
  buttonLabel?: string;

  /** How to upload the file (domain provides this) */
  onUpload: (file: File) => Promise<UploadedImage>;

  /** Upload UI state (domain provides this) */
  uploading?: boolean;
  uploadError?: string | null;

  /** Visual variants */
  variant?: "avatar" | "preview";
  avatarSize?: number; // px
  previewHeight?: number; // px

  /** Optional: clear support */
  onClear?: () => void;
  clearLabel?: string;
};

export function ImageUploadField<TFieldValues extends FieldValues>({
  control,
  setValue,
  imgUrl,
  imgPublicId,
  label = "Image",
  buttonLabel = "Upload image",
  onUpload,
  uploading,
  uploadError,

  variant = "preview",
  avatarSize = 64,
  previewHeight = 160,

  onClear,
  clearLabel = "Remove",
}: Props<TFieldValues>) {
  const reactId = useId();
  const inputId = useMemo(
    () => `${reactId}-${String(imgUrl)}-file-input`,
    [reactId, imgUrl],
  );

  const imageUrl = useWatch({ control, name: imgUrl }) as string | undefined;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // allow same file re-upload
    e.currentTarget.value = "";
    if (!file) return;

    const uploaded = await onUpload(file);

    setValue(imgUrl, uploaded.url as any, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(imgPublicId, uploaded.publicId as any, {
      shouldDirty: true,
      shouldValidate: false,
    });
  }

  const isAvatar = variant === "avatar";

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>

      <Controller
        name={imgUrl}
        control={control}
        render={({ fieldState }) => (
          <div
            className={clsx(isAvatar ? "flex items-center gap-3" : "space-y-2")}
          >
            {/* Avatar preview */}
            {isAvatar ? (
              <div
                className="shrink-0 overflow-hidden rounded-full border bg-muted flex items-center justify-center"
                style={{ width: avatarSize, height: avatarSize }}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt=""
                    width={avatarSize}
                    height={avatarSize}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-muted-foreground">
                    No image
                  </span>
                )}
              </div>
            ) : null}

            <div
              className={clsx(
                isAvatar ? "flex items-center gap-2" : "space-y-2",
              )}
            >
              <input
                id={inputId}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="xs"
                  className="text-xs"
                  onClick={() => document.getElementById(inputId)?.click()}
                  disabled={!!uploading}
                >
                  {uploading ? "Uploading..." : buttonLabel}
                </Button>

                {onClear && imageUrl ? (
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    className="text-xs"
                    onClick={onClear}
                    disabled={!!uploading}
                  >
                    {clearLabel}
                  </Button>
                ) : null}
              </div>

              {uploadError ? (
                <p className="text-xs text-red-500">{uploadError}</p>
              ) : null}

              {fieldState.error ? (
                <p className="text-xs text-red-500">
                  {fieldState.error.message}
                </p>
              ) : null}

              {/* Artwork preview */}
              {!isAvatar && imageUrl ? (
                <div className="space-y-1">
                  <p className="mb-1 text-xs text-muted-foreground">Preview:</p>
                  <div className="overflow-hidden rounded-md border bg-muted">
                    <Image
                      src={imageUrl}
                      alt=""
                      width={600}
                      height={600}
                      className="w-full object-contain"
                      style={{ height: previewHeight }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      />
    </div>
  );
}
