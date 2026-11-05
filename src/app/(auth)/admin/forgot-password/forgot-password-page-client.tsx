
"use client";

import { adminForgotPassword } from "@/features/admin/services/admin-auth.api";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordPageClient() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const forgotPasswordMutation = useMutation({
    mutationFn: () => adminForgotPassword(email.trim()),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || forgotPasswordMutation.isPending) return;

    forgotPasswordMutation.mutate();
  }

  return (
    <div className="mx-auto max-w-sm rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">
        {t("Forgot password?")}
      </h1>

      {forgotPasswordMutation.isSuccess ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-zinc-600">
            {t(
              "If an account exists with this email, you will receive a password reset link.",
            )}
          </p>

          <Link
            href="/admin/login"
            className="block text-center text-sm text-zinc-600 hover:text-zinc-900 hover:underline"
          >
            {t("Back to sign in")}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="text-sm text-zinc-600">
            {t(
              "Enter your email address and we'll send you a link to reset your password.",
            )}
          </p>

          <label className="block">
            <span className="text-sm text-zinc-600">
              {t("Email")}
            </span>

            <input
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {forgotPasswordMutation.isError && (
            <p className="text-sm text-red-600">
              {t("Unable to process your request. Please try again later.")}
            </p>
          )}

          <button
            type="submit"
            disabled={forgotPasswordMutation.isPending}
            className="w-full rounded-md bg-zinc-900 px-3 py-2 text-white disabled:opacity-50"
          >
            {forgotPasswordMutation.isPending
              ? t("Sending...")
              : t("Send reset link")}
          </button>

          <Link
            href="/admin/login"
            className="block text-center text-sm text-zinc-600 hover:text-zinc-900 hover:underline"
          >
            {t("Back to sign in")}
          </Link>
        </form>
      )}
    </div>
  );
}
