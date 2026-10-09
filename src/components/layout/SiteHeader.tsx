"use client";

import LanguageSwitcher from "@/components/ui/language-switcher";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const ART_CATALOG_URL =
  process.env.NEXT_PUBLIC_ART_CATALOG_URL || "http://localhost:3000";

export function SiteHeader() {
  const { t } = useTranslation();

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto max-w-6xl px-4">
        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex h-14 items-center justify-between">
            <Link
              href={ART_CATALOG_URL}
              className="flex flex-col leading-none hover:opacity-80"
            >
              <span className="text-base font-semibold tracking-tight">
                ArtCatalog
              </span>

              <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.15em] text-zinc-400">
                Creative Atlas
              </span>
            </Link>

            <LanguageSwitcher />
          </div>

          <nav className="flex h-9 items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
            <Link
              href={`${ART_CATALOG_URL}/artworks`}
              className="hover:text-black dark:hover:text-white"
            >
              {t("Gallery")}
            </Link>

            <Link
              href={`${ART_CATALOG_URL}/artists`}
              className="hover:text-black dark:hover:text-white"
            >
              {t("Artists")}
            </Link>

            <Link
              href={`${ART_CATALOG_URL}/about`}
              className="hover:text-black dark:hover:text-white"
            >
              {t("About")}
            </Link>

            <Link
              href={`${ART_CATALOG_URL}/contact`}
              className="hover:text-black dark:hover:text-white"
            >
              {t("Contact")}
            </Link>
          </nav>
        </div>

        {/* Desktop */}
        <div className="hidden h-14 items-center justify-between md:flex">
          <Link
            href="/"
            className="flex flex-col leading-none hover:opacity-80"
          >
            <span className="text-lg font-semibold tracking-tight">
              ArtCatalog
            </span>

            <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.15em] text-zinc-400">
              Creative Atlas
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300">
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
      </div>
    </header>
  );
}
