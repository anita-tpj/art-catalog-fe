"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useInquiryStats } from "@/hooks/inquiries/useInquiryStats";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/artworks", label: "Artworks" },
  { href: "/admin/artists", label: "Artists" },
  { href: "/admin/inquiries", label: "Admin" },
  // later: categories, settings...
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data } = useInquiryStats();

  const unread = data?.newCount ?? 0;

  return (
    <aside className="border-r border-zinc-200 pr-4 dark:border-zinc-800 hidden md:block">
      <nav className="flex flex-col gap-1.5 text-sm">
        {items.map((item) => {
          const segment = "/" + pathname.split("/").slice(1, 3).join("/");
          const active = segment === item.href;

          const isInbox = item.href === "/admin/inquiries";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-2.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
                active &&
                  "bg-zinc-900 text-zinc-50 hover:bg-zinc-900 hover:text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950",
              )}
            >
              <span>{item.label}</span>

              {/* NEW badge */}
              {isInbox && unread > 0 && (
                <span
                  className={cn(
                    "ml-2 inline-flex min-w-5 justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    active
                      ? "bg-zinc-50 text-zinc-900"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
