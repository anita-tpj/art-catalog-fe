"use client";

import { useAdminMe } from "@/features/admin/hooks/useAdminMe";
import {
  AdminUserDto,
  adminLogin,
} from "@/features/admin/services/admin-auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LoginPageClient() {
  const { t } = useTranslation();
  const router = useRouter();
  const qc = useQueryClient();
  const searchParams = useSearchParams();

  const rawNext = searchParams.get("next");

  const { data, isLoading } = useAdminMe();

  function getDefaultAdminUrl(user: AdminUserDto) {
    if (user.role === "ADMIN") {
      return "/admin";
    }

    if (user.artistId) {
      return `/admin/artists/${user.artistId}/edit`;
    }

    return "/admin";
  }

  function getRedirectUrl(user: AdminUserDto) {
    if (rawNext?.startsWith("/admin")) {
      return rawNext;
    }

    return getDefaultAdminUrl(user);
  }

  // Already logged in
  useEffect(() => {
    if (!data?.user) return;

    router.replace(getRedirectUrl(data.user));
  }, [data?.user, router, rawNext]);

  const [email, setEmail] = useState("admin@artcatalog.local");
  const [password, setPassword] = useState("admin12345");

  const loginMutation = useMutation({
    mutationFn: () => adminLogin(email, password),

    onSuccess: async (result) => {
      // Make sure all components using adminMe get the new session/user.
      qc.setQueryData(["adminMe"], result);

      router.replace(getRedirectUrl(result.user));
    },
  });

  if (isLoading || data?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/70 px-5 py-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-200" />

          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {t("Checking session…")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">{t("Admin login")}</h1>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-sm text-zinc-600">{t("Email")}</span>

          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="block">
          <span className="text-sm text-zinc-600">{t("Password")}</span>

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
            {(loginMutation.error as Error)?.message ?? t("Login failed")}
          </p>
        )}

        <button
          className="w-full rounded-md bg-zinc-900 px-3 py-2 text-white disabled:opacity-50"
          onClick={() => loginMutation.mutate()}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? t("Signing in...") : t("Sign in")}
        </button>
      </div>
    </div>
  );
}