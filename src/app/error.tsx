"use client";

import { Button } from "@/components/ui";
import { useTranslation } from "react-i18next";

export default function GlobalError({
  error,
}: {
  error: Error;
  reset: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <h2 className="text-lg font-semibold">{t("Something went wrong")}</h2>

      <p className="text-sm text-zinc-500">{t(error.message)}</p>

      <Button variant="outline" onClick={() => location.reload()}>
        {t("Reload page")}
      </Button>
    </div>
  );
}
