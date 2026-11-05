
"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type ArtistOnboardingProps = {
  userId: string;
};

export function ArtistOnboarding({ userId }: ArtistOnboardingProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const storageKey = `creative-atlas:onboarding:${userId}`;

useEffect(() => {
  const completed = localStorage.getItem(storageKey) === "completed";
  setIsVisible(!completed);

  const handleOpen = () => setIsVisible(true);

  window.addEventListener("creative-atlas:open-onboarding", handleOpen);

  return () => {
    window.removeEventListener("creative-atlas:open-onboarding", handleOpen);
  };
}, [storageKey]);

  function handleDismiss() {
    localStorage.setItem(storageKey, "completed");
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            {t("Welcome to Creative Atlas!")}
          </h2>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {t(
              "This is your space to showcase your creative work. Complete your profile and add the artworks you want to share.",
            )}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">{t("Your profile")}</p>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t("Add your photo, biography and profile details.")}
            </p>
          </div>

          <div>
            <p className="font-medium">{t("Your artworks")}</p>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t("Add and manage the artworks you want to showcase.")}
            </p>
          </div>

          <div>
            <p className="font-medium">{t("Publishing")}</p>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t(
                "Saving your changes does not publish them automatically. An administrator controls what becomes publicly visible.",
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-zinc-200 pt-4 dark:border-zinc-700">
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {t("Got it, let's start!")}
          </button>
        </div>
      </div>
    </section>
  );
}
