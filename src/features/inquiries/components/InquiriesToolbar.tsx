"use client";

import { Button } from "@/components/ui";
import { SearchInput } from "@/components/ui";
import clsx from "clsx";
import { InboxStatus, InquiryStats } from "../types";

type Props = {
  status: InboxStatus;
  onStatusChange: (s: InboxStatus) => void;

  search: string;
  onSearchChange: (v: string) => void;
  onClearSearch: () => void;

  stats?: InquiryStats;
};

const TABS: { value: InboxStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "ARCHIVED", label: "Archived" },
];

function getCount(stats: InquiryStats | undefined, v: InboxStatus) {
  if (!stats) return undefined;
  if (v === "ALL") return stats.allCount;
  if (v === "NEW") return stats.newCount;
  if (v === "READ") return stats.readCount;
  if (v === "ARCHIVED") return stats.archivedCount;
  return undefined;
}

export function InquiriesToolbar({
  status,
  onStatusChange,
  search,
  onSearchChange,
  onClearSearch,
  stats,
}: Props) {
  return (
    <section className="mt-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-start gap-2">
          {TABS.map((tab) => {
            const active = status === tab.value;
            const count = getCount(stats, tab.value);

            return (
              <Button
                key={tab.value}
                type="button"
                variant={active ? "primary" : "outline"}
                size="sm"
                onClick={() => onStatusChange(tab.value)}
                className={clsx(
                  "rounded-full flex items-center gap-1",
                  !active && "text-muted-foreground",
                )}
              >
                {tab.label}
                {typeof count === "number" && (
                  <span
                    className={clsx(
                      "text-xs font-semibold",
                      tab.value !== "NEW" && "hidden md:inline-flex",
                      active
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-foreground",
                    )}
                  >
                    ({count})
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        <div className="w-full md:w-80">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search inquiries..."
          />
        </div>
      </div>

      {search.trim() && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Search: {search.trim()}
          </span>
          <button
            type="button"
            onClick={onClearSearch}
            className="text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}
    </section>
  );
}
