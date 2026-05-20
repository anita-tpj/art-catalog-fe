import en from "@/locales/en/translation.json";
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
