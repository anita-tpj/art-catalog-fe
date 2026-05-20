import { getTranslation } from "@/i18n/server";
import { Suspense } from "react";
import LoginPageClient from "./login-page-client";

export default async function AdminLoginPage() {
  const { t } = await getTranslation();

  return (
    <Suspense fallback={<div className="p-6">{t("Loading...")}</div>}>
      <LoginPageClient />
    </Suspense>
  );
}
