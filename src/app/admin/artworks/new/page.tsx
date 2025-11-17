import { Card } from "@/components/ui/card";

export default function NewArtworkPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Create artwork</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Add a new artwork to the catalog.
      </p>

      <Card className="text-sm text-zinc-500 dark:text-zinc-400 border-dashed">
        Form for creating artwork will go here (RHForm + Zod + image upload).
      </Card>
    </section>
  );
}
