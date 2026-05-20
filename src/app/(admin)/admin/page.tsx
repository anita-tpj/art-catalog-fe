"use client";

import { AdminDashboardStats, useDashboardStats } from "@/features/admin";
import { useTranslation } from "react-i18next";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useDashboardStats();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("Dashboard")}
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {t("Overview of activity and content.")}
      </p>

      {isError ? (
        <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
          {error instanceof Error
            ? t(error.message)
            : t("Failed to load dashboard stats.")}
        </div>
      ) : (
        <AdminDashboardStats data={data} isLoading={isLoading} />
      )}
    </section>
  );
}
