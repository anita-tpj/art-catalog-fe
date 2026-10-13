"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

const sections = [
  { title: "introductionTitle", text: "introductionText" },
  { title: "controllerTitle", text: "controllerText" },
  { title: "dataCollectedTitle", text: "dataCollectedText" },
  { title: "purposesTitle", text: "purposesText" },
  { title: "legalBasisTitle", text: "legalBasisText" },
  { title: "sharingTitle", text: "sharingText" },
  { title: "transfersTitle", text: "transfersText" },
  { title: "cookiesTitle", text: "cookiesText" },
  { title: "retentionTitle", text: "retentionText" },
  { title: "securityTitle", text: "securityText" },
  { title: "rightsTitle", text: "rightsText" },
  { title: "changesTitle", text: "changesText" },
  { title: "contactTitle", text: "contactText" },
] as const;

export function PrivacyPageClient() {
  const { t } = useTranslation("privacy");

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {t("lastUpdated")}: {t("effectiveDate")}
        </p>
      </header>

      {sections.map(({ title, text }) => (
        <section key={title} className="space-y-4">
          <h2 className="text-xl font-semibold">{t(title)}</h2>

          <p className="whitespace-pre-line leading-7 text-zinc-600 dark:text-zinc-300">
            {t(text)}
          </p>
        </section>
      ))}

      <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <Link
          href="/terms"
          className="text-sm font-medium underline underline-offset-4 hover:text-zinc-500"
        >
          {t("termsLink")}
        </Link>
      </div>
    </article>
  );
}
