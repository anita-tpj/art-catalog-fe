import { PropsWithChildren } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid gap-6 md:grid-cols-[.5fr_1.5fr]">
      <aside className="border-r border-zinc-200 pr-4 dark:border-zinc-800">
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Admin
          </h2>
        </div>
        <AdminSidebar />
      </aside>

      <div className="space-y-4">{children}</div>
    </div>
  );
}
