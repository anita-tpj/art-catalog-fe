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
    <aside className="border-r border-zinc-200 pr-4 dark:border-zinc-800 hidden md:block">
      <nav className="flex flex-col gap-1.5 text-sm ">
        {items.map((item) => {
          const segment = "/" + pathname.split("/").slice(1, 3).join("/");
          const active = segment === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-2 py-2.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
                active &&
                  "bg-zinc-900 text-zinc-50 hover:bg-zinc-900 hover:text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
