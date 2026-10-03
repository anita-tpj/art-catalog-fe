"use client";

import { useRef, useState } from "react";

export type UploadedImage = { url: string; publicId: string };

interface UseArtistAvatarUploadOptions {
  onUploaded?: (payload: UploadedImage) => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function useArtistAvatarUpload({
  onUploaded,
}: UseArtistAvatarUploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tracks only temporary uploads made during the current form session.
  const lastUploadedPublicIdRef = useRef<string | null>(null);

  const deleteTemporaryUpload = async (publicId: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploads/artist-avatar?publicId=${encodeURIComponent(publicId)}`,
        { method: "DELETE" },
      );
    } catch (err) {
      console.error("Failed to delete temporary Cloudinary avatar:", err);
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploads/artist-avatar`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        throw new Error("Failed to upload profile image");
      }

      const data = await res.json();

      const payload: UploadedImage = {
        url: data.url,
        publicId: data.publicId,
      };

      const previousTemporaryPublicId = lastUploadedPublicIdRef.current;

      // New upload succeeded, so it is now safe to remove
      // the previous temporary upload.
      if (previousTemporaryPublicId) {
        await deleteTemporaryUpload(previousTemporaryPublicId);
      }

      lastUploadedPublicIdRef.current = payload.publicId;

      onUploaded?.(payload);

      return payload;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload profile image";

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
