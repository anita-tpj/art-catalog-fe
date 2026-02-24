"use client";

import { AdminMobileNav } from "@/features/admin/components/AdminMobileNav";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { useAdminMe } from "@/features/admin/hooks/useAdminMe";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import AdminGuard from "./AdminGuard";

export default function AdminLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { data, isLoading } = useAdminMe();

  const isLoginRoute = pathname === "/admin/login";
  const isAuthenticated = !!data?.user;

  /**
   * AdminGuard is responsible for redirecting unauthenticated users
   * away from protected admin routes.
   *
   * This layout only decides whether to show sidebar/navigation.
   */
  return (
    <AdminGuard>
      {/* Login page should never show admin navigation UI */}
      {isLoginRoute ? (
        <>{children}</>
      ) : isLoading ? (
        /**
         * While session is being checked, avoid rendering sidebar to prevent flicker.
         * AdminGuard will show its own loading/redirect behavior.
         */
        <>{children}</>
      ) : !isAuthenticated ? (
        /**
         * Not authenticated: AdminGuard will redirect to /admin/login.
         * Render children only to avoid UI flashing.
         */
        <>{children}</>
      ) : (
        /**
         * Authenticated admin layout
         */
        <div className="grid gap-6 md:grid-cols-[.5fr_1.5fr]">
          <AdminMobileNav />
          <AdminSidebar />
          <div className="space-y-4">{children}</div>
        </div>
      )}
    </AdminGuard>
  );
}
