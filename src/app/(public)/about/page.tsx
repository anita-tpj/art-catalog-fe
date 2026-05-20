import AboutPageClient from "./about-page-client";


export const metadata = {
  title: "About | ArtCatalog",
  description:
    "Learn about ArtCatalog — a curated platform dedicated to showcasing contemporary artworks and artists.",
};

export default function AboutPage() {
 
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <AboutPageClient />
    </main>
  );
}
