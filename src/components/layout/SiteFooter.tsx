"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-zinc-200 bg-white/60 py-6 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <span>© {new Date().getFullYear()} Creative Atlas</span>

        <div className="flex flex-wrap items-center gap-4 sm:justify-end">
          <span className="text-zinc-400">{t("Discover art & artists")}</span>
          <div className="flex gap-2">
            <Link
              href="/terms"
              className="transition hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              {t("Terms of Use")}
            </Link>

            <Link
              href="/privacy"
              className="transition hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              {t("Privacy Policy")}
            </Link>

            <Link
              href="/admin"
              className="text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
