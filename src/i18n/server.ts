import enPrivacy from "@/locales/en/privacy.json";
import enTerms from "@/locales/en/terms.json";
import en from "@/locales/en/translation.json";
import srPrivacy from "@/locales/sr/privacy.json";
import srTerms from "@/locales/sr/terms.json";
import sr from "@/locales/sr/translation.json";
import { cookies } from "next/headers";

const resources = {
  en,
  sr,
} as const;

type Lang = keyof typeof resources;

export async function getTranslation() {
  const cookieStore = await cookies();

  const rawLang =
    cookieStore.get("i18next")?.value ||
    cookieStore.get("lang")?.value ||
    cookieStore.get("locale")?.value ||
    "en";

  const lang: Lang = rawLang === "sr" ? "sr" : "en";
  const dictionary = resources[lang];

  return {
    lang,
    t: (key: string) => {
      const value = dictionary[key as keyof typeof dictionary];
      return typeof value === "string" && value.length ? value : key;
    },
  };
}

export async function getTermsTranslation() {
  const { lang } = await getTranslation();

  const dictionary = lang === "sr" ? srTerms : enTerms;

  return {
    lang,
    t: (key: string) => {
      const value = dictionary[key as keyof typeof dictionary];

      return typeof value === "string" && value.length ? value : key;
    },
  };
}

export async function getPrivacyTranslation() {
  const { lang } = await getTranslation();

  const dictionary = lang === "sr" ? srPrivacy : enPrivacy;

  return {
    lang,
    t: (key: string) => {
      const value = dictionary[key as keyof typeof dictionary];

      return typeof value === "string" && value.length ? value : key;
    },
  };
}
