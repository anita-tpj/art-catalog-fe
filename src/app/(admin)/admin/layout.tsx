"use client";

import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AdminMobileNav } from "@/components/shell/AdminMobileNav";
import { AdminSidebar } from "@/components/shell/AdminSidebar";
import { useAdminMe } from "@/features/admin/hooks/useAdminMe";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import AdminGuard from "../../../features/admin/components/AdminGuard";

export default function AdminLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { data, isLoading } = useAdminMe();

  const isLoginRoute = pathname === "/admin/login";
  const isAuthenticated = !!data?.user;

  /**
   * AdminGuard is responsible for redirecting unauthenticated users
   * away from protected admin routes.
   *
   * This layout decides whether to show the admin shell (topbar + nav).
   */
  return (
    <AdminGuard>
      {isLoginRoute ? (
        // Login page should never show admin navigation UI
        <div className="mx-auto w-full max-w-md px-4 py-10">{children}</div>
      ) : isLoading ? (
        // While session is being checked, avoid rendering nav to prevent flicker
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      ) : !isAuthenticated ? (
        // Not authenticated: AdminGuard will redirect to /admin/login
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      ) : (
        // Authenticated admin shell
        <div className="min-h-screen">
          <AdminTopBar />

          <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid min-w-0 gap-6 md:grid-cols-[240px_1fr]">
              <div className="md:hidden min-w-0 overflow-x-visible">
                <AdminMobileNav />
              </div>

              <div className="hidden md:block">
                <AdminSidebar />
              </div>
              <div className="min-w-0">
                {/* On mobile, avoid extra "card inside card" framing */}
                <div className="space-y-4 md:rounded-2xl md:border md:border-zinc-200 md:bg-white md:p-5 md:shadow-sm md:dark:border-zinc-800 md:dark:bg-zinc-900/40">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </AdminGuard>
  );
}
