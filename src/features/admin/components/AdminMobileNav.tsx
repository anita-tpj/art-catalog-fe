"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { useAdminLogout } from "@/features/admin/hooks/useAdminLogout";
import { useInquiryStats } from "@/features/inquiries/hooks/useInquiryStats";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/artworks", label: "Artworks" },
  { href: "/admin/artists", label: "Artists" },
  { href: "/admin/inquiries", label: "Inbox" },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const { data } = useInquiryStats();
  const logout = useAdminLogout();

  const unread = data?.newCount ?? 0;

  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateFades = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    // Small threshold to avoid flicker near edges
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 2);
  }, []);

  React.useEffect(() => {
    updateFades();

    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => updateFades();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateFades());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [updateFades]);

  return (
    <div className="mb-4 md:hidden">
      {/* Full-bleed inside max-w container */}
      <div className="-mx-4">
        <div className="relative">
          {/* Left fade */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-0 top-0 h-full w-10 opacity-0 transition-opacity",
              "bg-gradient-to-r from-zinc-50/85 via-zinc-50/45 to-transparent",
              "dark:from-zinc-950/85 dark:via-zinc-950/45",
              canScrollLeft && "opacity-100",
            )}
          />

          {/* Right fade */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute right-0 top-0 h-full w-12 opacity-0 transition-opacity",
              "bg-gradient-to-l from-zinc-50/85 via-zinc-50/45 to-transparent",
              "dark:from-zinc-950/85 dark:via-zinc-950/45",
              canScrollRight && "opacity-100",
            )}
          />

          <div
            ref={scrollerRef}
            className={cn(
              "no-scrollbar w-full max-w-full overflow-x-scroll overscroll-x-contain touch-pan-x",
              "[-webkit-overflow-scrolling:touch]",
            )}
          >
            <div className="flex w-max min-w-full items-center gap-2 px-4 pr-10">
              {links.map((item) => {
                const segment = "/" + pathname.split("/").slice(1, 3).join("/");
                const active = segment === item.href;
                const isInbox = item.href === "/admin/inquiries";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium border",
                      active
                        ? "bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-50"
                        : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700",
                    )}
                  >
                    {item.label}

                    {isInbox && unread > 0 && (
                      <span
                        className={cn(
                          "absolute -top-1 -right-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
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

              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium border",
                  "bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200 disabled:opacity-50",
                  "dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800",
                )}
              >
                {logout.isPending ? "..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
