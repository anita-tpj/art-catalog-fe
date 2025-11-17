import { Card } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Quick overview of your catalog.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>Artworks count (soon)</Card>
        <Card>Artists count (soon)</Card>
        <Card>Categories count (soon)</Card>
      </div>
    </section>
  );
}
