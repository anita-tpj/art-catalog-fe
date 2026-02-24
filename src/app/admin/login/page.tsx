"use client";

import { useAdminMe } from "@/features/admin/hooks/useAdminMe";
import { adminLogin } from "@/features/admin/services/admin-auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const searchParams = useSearchParams();

  // Only allow internal admin routes to prevent open redirects.
  const rawNext = searchParams.get("next") || "/admin";
  const nextUrl = rawNext.startsWith("/admin") ? rawNext : "/admin";

  const { data, isLoading } = useAdminMe();

  // already logged in → go to /admin
  useEffect(() => {
    if (data?.user) router.replace(nextUrl);
  }, [data?.user, router, nextUrl]);

  const [email, setEmail] = useState("admin@artcatalog.local");
  const [password, setPassword] = useState("admin12345");

  const loginMutation = useMutation({
    mutationFn: () => adminLogin(email, password),
    onSuccess: async () => {
      // refresh admin state
      await qc.invalidateQueries({ queryKey: ["adminMe"] });
      router.replace(nextUrl);
    },
  });

  if (isLoading || data?.user) {
    return (
      <div className="mx-auto max-w-sm rounded-xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-zinc-600">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Admin login</h1>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-sm text-zinc-600">Email</span>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="block">
          <span className="text-sm text-zinc-600">Password</span>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
          />
        </label>

        {loginMutation.isError && (
          <p className="text-sm text-red-600">
            {(loginMutation.error as Error)?.message ?? "Login failed"}
          </p>
        )}

        <button
          className="w-full rounded-md bg-zinc-900 px-3 py-2 text-white disabled:opacity-50"
          onClick={() => loginMutation.mutate()}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </div>
  );
}
