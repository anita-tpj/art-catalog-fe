import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: "ArtCatalog | Admin",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {children}
    </div>
  );
}
