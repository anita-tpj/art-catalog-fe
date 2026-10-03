"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
export default function LanguageSwitcher() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);

    document.cookie = `i18next=${lng}; path=/; max-age=31536000`;

    router.refresh();

    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Mobile */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Change language"
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <ReactCountryFlag
            countryCode={i18n.language.startsWith("sr") ? "RS" : "US"}
            svg
            style={{
              width: "1.25em",
              height: "1.25em",
            }}
          />
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-2 min-w-[70px] rounded border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => changeLanguage("en")}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                i18n.language.startsWith("en")
                  ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <ReactCountryFlag countryCode="US" svg />
              EN
            </button>

            <button
              type="button"
              onClick={() => changeLanguage("sr")}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                i18n.language.startsWith("sr")
                  ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <ReactCountryFlag countryCode="RS" svg />
              SR
            </button>
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden items-center gap-1 md:flex">
        <button
          type="button"
          onClick={() => changeLanguage("en")}
          className={`flex items-center gap-1.5 rounded px-2 py-1 text-sm transition-colors ${
            i18n.language.startsWith("en")
              ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
              : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
          }`}
        >
          <ReactCountryFlag countryCode="US" svg />
          EN
        </button>

        <button
          type="button"
          onClick={() => changeLanguage("sr")}
          className={`flex items-center gap-1.5 rounded px-2 py-1 text-sm transition-colors ${
            i18n.language.startsWith("sr")
              ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
              : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
          }`}
        >
          <ReactCountryFlag countryCode="RS" svg />
          SR
        </button>
      </div>
    </div>
  );
}
