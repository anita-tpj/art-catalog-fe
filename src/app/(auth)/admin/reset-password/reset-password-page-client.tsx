"use client";

import { adminResetPassword } from "@/features/admin/services/admin-auth.api";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPageClient() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";
  const isValidTokenFormat = /^[a-f0-9]{64}$/.test(token);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const resetMutation = useMutation({
    mutationFn: () => adminResetPassword(token, password),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setValidationError("");

    if (password.length < 12 || password.length > 100) {
      setValidationError(t("Password must be between 12 and 100 characters."));
      return;
    }

    if (password !== confirmPassword) {
      setValidationError(t("Passwords do not match."));
      return;
    }

    if (!isValidTokenFormat || resetMutation.isPending) return;

    resetMutation.mutate();
  }

  return (
    <div className="mx-auto max-w-sm rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">{t("Reset password")}</h1>

      {!isValidTokenFormat ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-red-600">
            {t("Invalid password reset link.")}
          </p>

          <Link
            href="/admin/forgot-password"
            className="block text-center text-sm text-zinc-600 hover:underline"
          >
            {t("Request a new reset link")}
          </Link>
        </div>
      ) : resetMutation.isSuccess ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-green-700">
            {t("Your password has been updated successfully.")}
          </p>

          <Link
            href="/admin/login"
            className="block text-center text-sm text-zinc-600 hover:underline"
          >
            {t("Back to sign in")}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="text-sm text-zinc-600">
            {t("Enter your new password below.")}
          </p>

          <label className="block">
            <span className="text-sm text-zinc-600">{t("New password")}</span>

            <input
              type="password"
              required
              minLength={12}
              maxLength={100}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm text-zinc-600">
              {t("Confirm new password")}
            </span>

            <input
              type="password"
              required
              minLength={12}
              maxLength={100}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>

          {validationError && (
            <p className="text-sm text-red-600">{validationError}</p>
          )}

          {resetMutation.isError && (
            <div className="space-y-2">
              <p className="text-sm text-red-600">
                {t("Unable to reset password. The link may have expired.")}
              </p>

              <Link
                href="/admin/forgot-password"
                className="block text-sm text-zinc-600 hover:underline"
              >
                {t("Request a new reset link")}
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={resetMutation.isPending}
            className="w-full rounded-md bg-zinc-900 px-3 py-2 text-white disabled:opacity-50"
          >
            {resetMutation.isPending
              ? t("Updating password...")
              : t("Reset password")}
          </button>

          <Link
            href="/admin/login"
            className="block text-center text-sm text-zinc-600 hover:underline"
          >
            {t("Back to sign in")}
          </Link>
        </form>
      )}
    </div>
  );
}
