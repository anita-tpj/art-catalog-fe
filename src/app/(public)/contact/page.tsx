// app/contact/page.tsx
import { ContactPageClient } from "./contact-page-client";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export const metadata = {
  title: "Contact | ArtCatalog",
  description:
    "Get in touch with ArtCatalog for inquiries, collaborations, or questions about artworks and artists.",
};

export default async function ContactPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const artworkId = sp.artworkId ? Number(sp.artworkId) : undefined;
  const artistId = sp.artistId ? Number(sp.artistId) : undefined;

  return (
    <ContactPageClient
      artworkId={Number.isFinite(artworkId) ? artworkId : undefined}
      artistId={Number.isFinite(artistId) ? artistId : undefined}
    />
  );
}
