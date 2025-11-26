import { PropsWithChildren } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="grid gap-6 md:grid-cols-[.5fr_1.5fr]">
      <AdminMobileNav />
      <AdminSidebar />
      <div className="space-y-4">{children}</div>
    </div>
  );
}
