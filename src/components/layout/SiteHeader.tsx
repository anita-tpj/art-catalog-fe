"use client";

import LanguageSwitcher from "@/components/ui/language-switcher";
import { URLS } from "@/lib/config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export function SiteHeader() {
  const { t } = useTranslation();

  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const navLinkClass = (path: string) =>
    `transition-colors ${
      isActive(path)
        ? "text-black dark:text-white"
        : "hover:text-black dark:hover:text-white"
    }`;

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto max-w-6xl px-4">
        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex h-14 items-center justify-between">
            <Link
              href={URLS.artCatalog}
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
          <nav className="site-header-navigation flex h-9 items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
            <Link
              href={`${URLS.artCatalog}/artworks`}
              className={navLinkClass("/artworks")}
            >
              {t("Gallery")}
            </Link>

            <Link
              href={`${URLS.artCatalog}/artists`}
              className={navLinkClass("/artists")}
            >
              {t("Artists")}
            </Link>

            <Link
              href={`${URLS.artCatalog}/about`}
              className={navLinkClass("/about")}
            >
              {t("About")}
            </Link>

            <Link
              href={`${URLS.artCatalog}/contact`}
              className={navLinkClass("/contact")}
            >
              {t("Contact")}
            </Link>
          </nav>
        </div>

        {/* Desktop */}
        <div className="hidden h-14 items-center justify-between md:flex">
          <Link
            href={URLS.artCatalog}
            className="flex flex-col leading-none hover:opacity-80"
          >
            <span className="text-lg font-semibold tracking-tight">
              ArtCatalog
            </span>

            <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.15em] text-zinc-400">
              Creative Atlas
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300">
            <nav className="site-header-navigation flex items-center gap-6">
              <Link
                href={`${URLS.artCatalog}/artworks`}
                className={navLinkClass("/artworks")}
              >
                {t("Gallery")}
              </Link>

              <Link
                href={`${URLS.artCatalog}/artists`}
                className={navLinkClass("/artists")}
              >
                {t("Artists")}
              </Link>

              <Link
                href={`${URLS.artCatalog}/about`}
                className={navLinkClass("/about")}
              >
                {t("About")}
              </Link>

              <Link
                href={`${URLS.artCatalog}/contact`}
                className={navLinkClass("/contact")}
              >
                {t("Contact")}
              </Link>
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
