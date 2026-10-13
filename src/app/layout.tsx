import { SEO_INDEXING_ENABLED } from "@/lib/config";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { getTranslation } from "@/i18n/server";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();

  return {
    title: {
      default: "Creative Atlas",
      template: "%s | Creative Atlas",
    },
    description: t(
      "Discover artists, explore original artworks, and connect with creators on Creative Atlas.",
    ),
    robots: {
      index: SEO_INDEXING_ENABLED,
      follow: SEO_INDEXING_ENABLED,
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
