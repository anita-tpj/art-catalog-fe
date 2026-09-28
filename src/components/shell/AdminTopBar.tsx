"use client";

import { useAdminHome } from "@/features/admin/hooks/useAdminHome";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../ui/language-switcher";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";

export function AdminTopBar() {
  const { t } = useTranslation();
  const adminHome = useAdminHome();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Row 1: Brand + current page + actions */}
        <div className="flex h-14 items-center justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-3">
              <Link
                href={adminHome.href}
                className="text-sm font-semibold tracking-tight hover:opacity-80"
              >
                {t("ArtCatalog")}
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 pl-2">
                  {t("Admin")}
                </span>
              </Link>
            </div>

            <AdminBreadcrumbs />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {t("View site")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
