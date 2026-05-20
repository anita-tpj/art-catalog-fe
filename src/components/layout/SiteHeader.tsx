"use client";

import LanguageSwitcher from "@/components/ui/language-switcher";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function SiteHeader() {
  const { t } = useTranslation();

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:bg-zinc-900/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight md:text-lg"
        >
          {t("ArtCatalog")}
        </Link>

        <nav className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300 lg:gap-6">
          <Link
            href="/artworks"
            className="hover:text-black dark:hover:text-white"
          >
            {t("Gallery")}
          </Link>

          <Link
            href="/artists"
            className="hover:text-black dark:hover:text-white"
          >
            {t("Artists")}
          </Link>

          <Link
            href="/about"
            className="hover:text-black dark:hover:text-white"
          >
            {t("About")}
          </Link>

          <Link
            href="/contact"
            className="hover:text-black dark:hover:text-white"
          >
            {t("Contact")}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
