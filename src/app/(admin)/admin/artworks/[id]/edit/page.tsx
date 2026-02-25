// app/admin/artists/[id]/edit/page.tsx

import { EditArtworkPage } from "@/features/artworks/components/admin/EditArtworkPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return <div>Invalid artwork id in URL</div>;
  }

  return <EditArtworkPage id={numericId} />;
}
