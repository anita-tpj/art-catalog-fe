"use client";

import { useAdminLogout } from "@/features/admin/hooks/useAdminLogout";
import { useInquiryStats } from "@/features/inquiries/hooks/useInquiryStats";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/artworks", label: "Artworks" },
  { href: "/admin/artists", label: "Artists" },
  { href: "/admin/inquiries", label: "Inbox" },
  // later: categories, settings...
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data } = useInquiryStats();
  const logout = useAdminLogout();

  const unread = data?.newCount ?? 0;

  return (
    <aside className="hidden md:block">
      <div className="sticky top-20 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
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

        <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className={cn(
              "w-full rounded-md px-2 py-2.5 text-left text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
            )}
          >
            {logout.isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
}
