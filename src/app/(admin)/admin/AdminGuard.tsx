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
      <div className="rounded-2xl border p-4 text-sm text-zinc-600">
        Checking admin session...
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
