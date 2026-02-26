import { Suspense } from "react";
import LoginPageClient from "./login-page-client";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <LoginPageClient />
    </Suspense>
  );
}
