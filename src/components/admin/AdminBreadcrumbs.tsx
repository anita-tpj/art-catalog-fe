"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  admin: "Dashboard",
  artworks: "Artworks",
  artists: "Artists",
  inquiries: "Inbox",
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] !== "admin") return null;

  return (
    <nav className="text-xs text-zinc-500 dark:text-zinc-400">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/admin"
          className="hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Dashboard
        </Link>

        {segments.slice(1).map((seg, i) => {
          const href = `/admin/${segments.slice(1, i + 2).join("/")}`;
          const label = LABELS[seg] ?? seg;

          return (
            <span key={href} className="flex items-center gap-2">
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <Link
                href={href}
                className="hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                {label}
              </Link>
            </span>
          );
        })}
      </div>
    </nav>
  );
}
