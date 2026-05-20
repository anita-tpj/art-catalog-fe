import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import LoginPageClient from "./login-page-client";

export default function AdminLoginPage() {
  const { t } = useTranslation();

  return (
    <Suspense fallback={<div className="p-6">{t("Loading...")}</div>}>
      <LoginPageClient />
    </Suspense>
  );
}
