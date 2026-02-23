"use client";

import { AdminDashboardStats } from "@/features/admin/components/AdminDashboardStats";
import { useDashboardStats } from "@/hooks/admin/useDashboardStats";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useDashboardStats();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Overview of activity and content.
      </p>

      {isError ? (
        <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Failed to load dashboard stats."}
        </div>
      ) : (
        <AdminDashboardStats data={data} isLoading={isLoading} />
      )}
    </section>
  );
}
