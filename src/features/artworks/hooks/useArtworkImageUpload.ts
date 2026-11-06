"use client";

import { ApiError } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useRef, useState } from "react";

export type UploadedImage = { url: string; publicId: string };

interface UseArtworkImageUploadOptions {
  onUploaded?: (payload: UploadedImage) => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function useArtworkImageUpload({
  onUploaded,
}: UseArtworkImageUploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tracks temporary uploads made during the current form session.
  const lastUploadedPublicIdRef = useRef<string | null>(null);

  const deleteTemporaryUpload = async (publicId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploads/artwork-image?publicId=${encodeURIComponent(publicId)}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        console.error(
          "Failed to delete temporary Cloudinary image:",
          res.status,
        );
      }
    } catch (err) {
      console.error("Failed to delete temporary Cloudinary image:", err);
    }
  };

  const uploadFile = async (file: File): Promise<UploadedImage> => {
    setError(null);

    try {
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new ApiError("Invalid file type", 400, "INVALID_FILE_TYPE");
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new ApiError("File too large", 413, "FILE_TOO_LARGE");
      }

      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploads/artwork-image`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      if (!res.ok) {
        const response = await res.json().catch(() => null);

        throw new ApiError(
          response?.message ?? "Failed to upload image",
          res.status,
          response?.code,
        );
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
      console.error("Artwork image upload failed:", err);

      setError(getErrorMessage(err, "Failed to upload image"));

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
