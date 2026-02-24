import { AdminMobileNav } from "@/features/admin/components/AdminMobileNav";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid gap-6 md:grid-cols-[.5fr_1.5fr]">
      <AdminMobileNav />
      <AdminSidebar />
      <div className="space-y-4">{children}</div>
    </div>
  );
}
