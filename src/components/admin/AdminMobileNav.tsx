"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/artworks", label: "Artworks" },
  { href: "/admin/artists", label: "Artists" },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 overflow-x-auto mb-4 md:hidden">
      {links.map((item) => {
        const segment = "/" + pathname.split("/").slice(1, 3).join("/");
        const active = segment === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium border",
              active
                ? "bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-50"
                : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
