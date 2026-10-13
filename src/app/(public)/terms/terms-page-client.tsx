"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

const sections = [
  { title: "introduction", text: "introductionText" },
  { title: "operatorTitle", text: "operatorText" },
  { title: "accountsTitle", text: "accountsText" },
  { title: "copyrightTitle", text: "copyrightText" },
  { title: "licenseTitle", text: "licenseText" },
  { title: "prohibitedTitle", text: "prohibitedText" },
  { title: "inquiriesTitle", text: "inquiriesText" },
  { title: "moderationTitle", text: "moderationText" },
  { title: "liabilityTitle", text: "liabilityText" },
  { title: "changesTitle", text: "changesText" },
  { title: "contactTitle", text: "contactText" },
] as const;

export function TermsPageClient() {
  const { t } = useTranslation("terms");

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

          {title === "operatorTitle" && (
            <div className="space-y-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              <p>{t("operatorAddress")}</p>
              <p>{t("operatorTaxId")}</p>
              <p>{t("operatorRegistration")}</p>
            </div>
          )}
        </section>
      ))}

      <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <Link
          href="/privacy"
          className="text-sm font-medium underline underline-offset-4 hover:text-zinc-500"
        >
          {t("privacyLink")}
        </Link>
      </div>
    </article>
  );
}
