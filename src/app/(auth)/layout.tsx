import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteLogo } from "@/components/layout/SiteLogo";
import LanguageSwitcher from "@/components/ui/language-switcher";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Creative Atlas | CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto max-w-6xl px-4 flex h-14 items-center justify-between">
          <SiteLogo />
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
