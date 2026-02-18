// app/contact/page.tsx
import { ContactPageClient } from "./contact-page-client";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function ContactPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const artworkId = sp.artworkId ? Number(sp.artworkId) : undefined;
  const artistId = sp.artistId ? Number(sp.artistId) : undefined;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <ContactPageClient
        artworkId={Number.isFinite(artworkId) ? artworkId : undefined}
        artistId={Number.isFinite(artistId) ? artistId : undefined}
      />
    </main>
  );
}
