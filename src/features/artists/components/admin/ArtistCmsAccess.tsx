"use client";

import { Button, Card, ConfirmDialog, Spinner } from "@/components/ui";
import { useAdminMe } from "@/features/admin/hooks/useAdminMe";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useArtistCmsAccess } from "../../hooks/useArtistCmsAccess";
import { useArtistCmsAccountActions } from "../../hooks/useArtistCmsAccountActions";
import { useCreateArtistCmsInvitation } from "../../hooks/useCreateArtistCmsInvitation";
import { useRevokeArtistCmsInvitation } from "../../hooks/useRevokeArtistCmsInvitation";

interface ArtistCmsAccessProps {
  artistId: number;
}

export function ArtistCmsAccess({ artistId }: ArtistCmsAccessProps) {
  const { t } = useTranslation();
  const { data: adminData, isLoading: isAdminLoading } = useAdminMe();

  const isAdmin = adminData?.user.role === "ADMIN";

  const { data: access, isLoading: isAccessLoading } = useArtistCmsAccess(
    artistId,
    isAdmin,
  );

  const createInvitation = useCreateArtistCmsInvitation(artistId);
  const revokeInvitation = useRevokeArtistCmsInvitation(artistId);

  const { deactivate, activate, remove } = useArtistCmsAccountActions(artistId);

  const [email, setEmail] = useState("");

  const isAccountActionPending =
    deactivate.isPending || activate.isPending || remove.isPending;

  const handleDeactivate = (userId: string) => {
    deactivate.mutate(userId, {
      onSuccess: () => {
        toast.success(t("CMS account deactivated successfully."));
      },
      onError: () => {
        toast.error(t("Failed to deactivate CMS account."));
      },
    });
  };

  const handleActivate = (userId: string) => {
    activate.mutate(userId, {
      onSuccess: () => {
        toast.success(t("CMS account activated successfully."));
      },
      onError: () => {
        toast.error(t("Failed to activate CMS account."));
      },
    });
  };

  const handleDelete = (userId: string) => {
    remove.mutate(userId, {
      onSuccess: () => {
        toast.success(t("CMS account deleted successfully."));
      },
      onError: () => {
        toast.error(t("Failed to delete CMS account."));
      },
    });
  };

  if (isAdminLoading || !isAdmin) {
    return null;
  }

  return (
    <Card className="border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">{t("CMS Access")}</h2>

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t("Manage CMS access for this artist.")}
          </p>
        </div>

        {isAccessLoading && (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Spinner size="sm" />
            {t("Loading CMS access...")}
          </div>
        )}

        {!isAccessLoading && access?.status === "ACTIVE" && (
          <div className="space-y-3">
            {access.accounts.map((account) => (
              <div
                key={account.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-zinc-200 p-3 dark:border-zinc-700"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {account.email}
                  </p>

                  <p className="text-xs text-zinc-500">
                    {t("Role")}: {t(account.role)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      account.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {account.isActive ? t("Active") : t("Inactive")}
                  </span>

                  {account.role !== "ADMIN" && (
                    <>
                      {account.isActive ? (
                        <ConfirmDialog
                          title={t("Deactivate CMS account")}
                          description={t(
                            "This user will lose CMS access immediately and will need to log in again if reactivated.",
                          )}
                          confirmLabel="Deactivate"
                          onConfirm={() => handleDeactivate(account.id)}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isAccountActionPending}
                          >
                            {t("Deactivate")}
                          </Button>
                        </ConfirmDialog>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isAccountActionPending}
                          onClick={() => handleActivate(account.id)}
                        >
                          {t("Activate")}
                        </Button>
                      )}

                      <ConfirmDialog
                        title={t("Delete CMS account")}
                        description={t(
                          "This permanently deletes the CMS account, but keeps the artist profile and artworks.",
                        )}
                        confirmLabel="Delete"
                        onConfirm={() => handleDelete(account.id)}
                      >
                        <Button
                          type="button"
                          variant="destructive"
                          disabled={isAccountActionPending}
                        >
                          {t("Delete")}
                        </Button>
                      </ConfirmDialog>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isAccessLoading &&
          access?.status === "PENDING" &&
          access.invitation && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-amber-900">
                    {access.invitation.email}
                  </p>

                  <p className="text-xs text-amber-700">
                    {t("Invitation pending")}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                  {t("Pending")}
                </span>
              </div>

              <div className="mt-1 text-right">
                <Button
                  type="button"
                  variant="link"
                  disabled={revokeInvitation.isPending}
                  onClick={() => revokeInvitation.mutate(access.invitation!.id)}
                >
                  {t("Revoke invitation")}
                </Button>
              </div>
            </div>
          )}

        {!isAccessLoading && access?.status === "NONE" && (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();

              const normalizedEmail = email.trim();

              if (!normalizedEmail) return;

              createInvitation.mutate(
                { email: normalizedEmail },
                {
                  onSuccess: () => setEmail(""),
                },
              );
            }}
          >
            <div className="space-y-1">
              <label htmlFor="artist-cms-email" className="text-sm font-medium">
                {t("Email")}
              </label>

              <input
                id="artist-cms-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("Artist email")}
                required
                className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
              />
            </div>

            <Button
              type="submit"
              disabled={createInvitation.isPending || !email.trim()}
            >
              {createInvitation.isPending && (
                <Spinner size="sm" className="mr-2" />
              )}

              {t("Invite artist")}
            </Button>

            <p className="text-xs text-zinc-500">
              {t(
                "The artist will receive an invitation to create their CMS account.",
              )}
            </p>
          </form>
        )}
      </div>
    </Card>
  );
}
