// app/admin/artists/[id]/edit/page.tsx

import { EditArtistPage } from "@/features/artists/components/admin/EditArtistPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return <div>Invalid artist id in URL</div>;
  }

  return <EditArtistPage id={numericId} />;
}
