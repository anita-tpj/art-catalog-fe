"use client";

import { useRef, useState } from "react";

export type UploadedImage = { url: string; publicId: string };

interface UseArtworkImageUploadOptions {
  onUploaded?: (payload: UploadedImage) => void;
}

export function useArtworkImageUpload({
  onUploaded,
}: UseArtworkImageUploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save only publicId uploaded in this session (create/edit form)
  const lastUploadedPublicIdRef = useRef<string | null>(null);

  const deletePreviousIfAny = async () => {
    const prevId = lastUploadedPublicIdRef.current;
    if (!prevId) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploads/artwork-image?publicId=${encodeURIComponent(prevId)}`,
        { method: "DELETE" },
      );
    } catch (err) {
      console.error("Failed to delete previous Cloudinary image:", err);
    }
  };

  const uploadFile = async (file: File): Promise<UploadedImage> => {
    setError(null);
    setUploading(true);

    try {
      await deletePreviousIfAny();

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

      const payload: UploadedImage = { url: data.url, publicId: data.publicId };

      lastUploadedPublicIdRef.current = payload.publicId;

      onUploaded?.(payload);

      return payload;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload image";

      console.error(err);
      setError(message);
      throw err; // IMPORTANT: let UI component know it failed
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    // allow same file to be selected again
    event.currentTarget.value = "";
    if (!file) return;
    await uploadFile(file);
  };

  return {
    uploading,
    error,
    uploadFile, // ✅ NEW
    handleFileChange, // still available if you want legacy usage
  };
}
