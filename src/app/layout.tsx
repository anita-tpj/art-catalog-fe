import { SEO_INDEXING_ENABLED } from "@/lib/config";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArtCatalog",
  description: "Art catalog and admin panel for managing artworks.",
  robots: {
    index: SEO_INDEXING_ENABLED,
    follow: SEO_INDEXING_ENABLED,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
