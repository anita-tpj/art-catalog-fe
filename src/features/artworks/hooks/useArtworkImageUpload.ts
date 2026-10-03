"use client";

import { useRef, useState } from "react";

export type UploadedImage = { url: string; publicId: string };

interface UseArtworkImageUploadOptions {
  onUploaded?: (payload: UploadedImage) => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function useArtworkImageUpload({
  onUploaded,
}: UseArtworkImageUploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tracks only temporary uploads made during the current form session.
  const lastUploadedPublicIdRef = useRef<string | null>(null);

  const deleteTemporaryUpload = async (publicId: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploads/artwork-image?publicId=${encodeURIComponent(publicId)}`,
        { method: "DELETE" },
      );
    } catch (err) {
      console.error("Failed to delete temporary Cloudinary image:", err);
    }
  };

  const uploadFile = async (file: File): Promise<UploadedImage> => {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      const message = "Please upload a JPG, PNG or WebP image.";
      setError(message);
      throw new Error(message);
    }

    if (file.size > MAX_FILE_SIZE) {
      const message = "Image must be smaller than 5 MB.";
      setError(message);
      throw new Error(message);
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploads/artwork-image`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();

      const payload: UploadedImage = {
        url: data.url,
        publicId: data.publicId,
      };

      const previousTemporaryPublicId = lastUploadedPublicIdRef.current;

      if (previousTemporaryPublicId) {
        await deleteTemporaryUpload(previousTemporaryPublicId);
      }

      lastUploadedPublicIdRef.current = payload.publicId;

      onUploaded?.(payload);

      return payload;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload image";

      console.error(err);
      setError(message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    error,
    uploadFile,
  };
}
