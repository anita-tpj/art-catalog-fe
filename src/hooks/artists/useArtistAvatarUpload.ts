import { useRef, useState } from "react";

interface UseArtistAvatarUploadOptions {
  onUploaded: (payload: { url: string; publicId: string }) => void;
}

export function useArtistAvatarUpload({
  onUploaded,
}: UseArtistAvatarUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastUploadedPublicIdRef = useRef<string | null>(null);

  const deletePreviousIfAny = async () => {
    const prevId = lastUploadedPublicIdRef.current;
    if (!prevId) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploads/artist-avatar?publicId=${encodeURIComponent(
          prevId
        )}`,
        { method: "DELETE" }
      );
    } catch (err) {
      console.error("Failed to delete previous Cloudinary avatar:", err);
    }
  };

  const uploadFile = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      await deletePreviousIfAny();

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploads/artist-avatar`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to upload avatar");
      }

      const data = await res.json(); // { url, publicId }

      lastUploadedPublicIdRef.current = data.publicId;

      onUploaded({
        url: data.url,
        publicId: data.publicId,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload avatar";
      console.error(err);
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    uploadFile(file);
  };

  return {
    uploading,
    error,
    handleFileChange,
  };
}
