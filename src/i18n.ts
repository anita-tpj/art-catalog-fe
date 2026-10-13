import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enPrivacy from "./locales/en/privacy.json";
import enTerms from "./locales/en/terms.json";
import en from "./locales/en/translation.json";
import srPrivacy from "./locales/sr/privacy.json";
import srTerms from "./locales/sr/terms.json";
import sr from "./locales/sr/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
        terms: enTerms,
        privacy: enPrivacy,
      },
      sr: {
        translation: sr,
        terms: srTerms,
        privacy: srPrivacy,
      },
    },

    fallbackLng: "en",

    detection: {
      order: ["cookie", "localStorage", "navigator"],
      caches: ["cookie"],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
