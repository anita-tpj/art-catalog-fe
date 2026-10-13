import { getTranslation } from "@/i18n/server";
import { Suspense } from "react";
import AcceptInvitationPageClient from "./accept-invitation-page-client";

export default async function AcceptInvitationPage() {
  const { t } = await getTranslation();

  return (
    <Suspense fallback={<div className="p-6">{t("Loading...")}</div>}>
      <AcceptInvitationPageClient />
    </Suspense>
  );
}
