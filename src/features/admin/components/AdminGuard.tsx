"use client";

import { useAdminMe } from "@/features/admin/hooks/useAdminMe";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const isLogin = pathname === "/admin/login";
  const { data, isLoading, isError } = useAdminMe();

  useEffect(() => {
    if (isLogin) return;

    /**
     * If session check finished and user is missing (or request failed),
     * redirect to login and remember the originally requested admin route.
     */
    if (!isLoading && (!data?.user || isError)) {
      const next = encodeURIComponent(pathname || "/admin");
      router.replace(`/admin/login?next=${next}`);
    }
  }, [isLogin, isLoading, data?.user, isError, pathname, router]);

  // Login route is public.
  if (isLogin) return <>{children}</>;

  // While checking session, show a lightweight loading state.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/70 px-5 py-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-200" />
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Checking admin session…
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, we redirect via effect; render nothing to avoid UI flicker.
  if (!data?.user || isError) return null;

  // Optional: role gate (currently only ADMIN).
  if (data.user.role !== "ADMIN") {
    return (
      <div className="rounded-2xl border p-4 text-sm text-zinc-600">
        Forbidden.
      </div>
    );
  }

  return <>{children}</>;
}
