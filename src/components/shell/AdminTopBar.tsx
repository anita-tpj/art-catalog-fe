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
      <div className="mx-auto w-full max-w-6xl px-4 py-2 sm:px-6 lg:px-8 lg:py-4">
        {/* Row 1: Brand + current page + actions */}
        <div className="flex h-14 items-center justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex items-center">
              <Link
                href={adminHome.href}
                className="flex flex-col leading-none hover:opacity-80"
              >
                <span className="text-base font-semibold tracking-tight">
                  ArtCatalog
                </span>

                <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.15em] text-zinc-400">
                  Creative Atlas
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
