import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import sr from "./locales/sr/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      sr: {
        translation: sr,
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
