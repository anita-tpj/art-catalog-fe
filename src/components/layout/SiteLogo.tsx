"use client";

import { URLS } from "@/lib/config";
import Link from "next/link";

export function SiteLogo() {
  return (
    <>
      <Link
        href={URLS.artCatalog}
        className="flex flex-col leading-none hover:opacity-80"
      >
        <span className="text-base font-semibold tracking-tight">
          ArtCatalog
        </span>

        <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.15em] text-zinc-400">
          Creative Atlas
        </span>
      </Link>
    </>
  );
}
