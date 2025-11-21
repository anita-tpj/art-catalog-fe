"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/artworks", label: "Artworks" },
  { href: "/admin/artists", label: "Artists" },
  // later: categories, settings...
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 text-sm">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-2 py-1 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
              active &&
                "bg-zinc-900 text-zinc-50 hover:bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-950"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
