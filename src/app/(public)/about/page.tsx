export const metadata = {
  title: "About | ArtCatalog",
  description:
    "Learn about ArtCatalog — a curated platform dedicated to showcasing contemporary artworks and artists.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        About ArtCatalog
      </h1>

      <p className="text-zinc-600 dark:text-zinc-300">
        ArtCatalog is a curated digital space for showcasing contemporary
        artworks and artists. It provides a clean and focused environment for
        discovering visual work and connecting with creators.
      </p>

      <p className="text-zinc-600 dark:text-zinc-300">
        The platform is designed with simplicity and clarity in mind — allowing
        artworks to speak for themselves while making exploration effortless.
      </p>
    </div>
  );
}
