"use client";

import {
  acceptAdminInvitation,
  getAdminInvitation,
} from "@/features/admin/services/admin-invitation.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

export default function AcceptInvitationPageClient() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);

  const invitationQuery = useQuery({
    queryKey: ["admin-invitation", token],
    queryFn: () => getAdminInvitation(token),
    enabled: !!token,
    retry: false,
  });

  const acceptMutation = useMutation({
    mutationFn: () =>
      acceptAdminInvitation({
        token,
        password,
      }),

    onSuccess: () => {
      setIsAccepted(true);
      setFormError(null);
    },

    onError: (error) => {
      setFormError(
        error instanceof Error
          ? error.message
          : t("Failed to create CMS account"),
      );
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (password.length < 8) {
      setFormError(t("Password must be at least 8 characters"));
      return;
    }

    if (password !== confirmPassword) {
      setFormError(t("Passwords do not match"));
      return;
    }

    acceptMutation.mutate();
  }

  if (!token) {
    return (
      <PageContainer>
        <MessageCard
          title={t("Invalid invitation")}
          message={t("The invitation link is invalid.")}
        />
      </PageContainer>
    );
  }

  if (invitationQuery.isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center gap-3 py-8">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
          <p className="text-sm text-zinc-600">{t("Checking invitation...")}</p>
        </div>
      </PageContainer>
    );
  }

  if (invitationQuery.isError || !invitationQuery.data) {
    return (
      <PageContainer>
        <MessageCard
          title={t("Invitation unavailable")}
          message={t(
            "This invitation is invalid, expired, or has already been used.",
          )}
        />
      </PageContainer>
    );
  }

  if (isAccepted) {
    return (
      <PageContainer>
        <MessageCard
          title={t("Your CMS account is ready")}
          message={t(
            "Your account has been created. You can now sign in to Creative Atlas.",
          )}
        >
          <Link
            href="/admin/login"
            className="mt-5 block w-full rounded-md bg-zinc-900 px-3 py-2 text-center text-sm font-medium text-white"
          >
            {t("Sign in")}
          </Link>
        </MessageCard>
      </PageContainer>
    );
  }

  const invitation = invitationQuery.data.invitation;

  return (
    <PageContainer>
      <div className="mx-auto max-w-sm rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">
          {t("Create your CMS account")}
        </h1>

        <p className="mt-2 text-sm text-zinc-600">
          {t("You've been invited to manage the CMS profile for")}{" "}
          <strong>{invitation.artist.name}</strong>.
        </p>

        <div className="mt-5 rounded-md bg-zinc-50 px-3 py-2">
          <p className="text-xs text-zinc-500">{t("Email")}</p>
          <p className="text-sm font-medium">{invitation.email}</p>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm text-zinc-600">{t("Password")}</span>

            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-zinc-600">
              {t("Confirm password")}
            </span>

            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={acceptMutation.isPending}
            className="w-full rounded-md bg-zinc-900 px-3 py-2 text-white disabled:opacity-50"
          >
            {acceptMutation.isPending
              ? t("Creating account...")
              : t("Create account")}
          </button>
        </form>
      </div>
    </PageContainer>
  );
}

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      {children}
    </div>
  );
}

function MessageCard({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-sm rounded-xl border bg-white p-6 text-center shadow-sm">
      <h1 className="text-xl font-semibold">{title}</h1>

      <p className="mt-2 text-sm text-zinc-600">{message}</p>

      {children}
    </div>
  );
}
