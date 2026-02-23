"use client";

import { useMemo } from "react";
import type { AdminDashboardStats as Stats } from "@/services/adminDashboard";
import {
  MdOutlineCollections,
  MdOutlinePerson,
  MdOutlineMail,
  MdAccessTime,
} from "react-icons/md";
import clsx from "clsx";
import { StatCard } from "./StatCard";
import { ListRow } from "./ListRow";
import { formatCompactTime, formatRelativeTime } from "@/lib/utils";
import { StatCardSkeleton } from "./StatCardSkeleton";

type Props = {
  data?: Stats;
  isLoading?: boolean;
};

export function AdminDashboardStats({ data, isLoading }: Props) {
  const lastRelative = useMemo(
    () => formatRelativeTime(data?.lastInquiryAt ?? null),
    [data?.lastInquiryAt],
  );
  const lastExact = useMemo(
    () => formatCompactTime(data?.lastInquiryAt ?? null),
    [data?.lastInquiryAt],
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatCard
        title="Artworks"
        value={data?.artworksCount ?? "—"}
        subtitle="Total artworks in catalog"
        icon={<MdOutlineCollections size={18} />}
        href="/admin/artworks"
      >
        <div className="space-y-1">
          {data?.lastArtworks?.length ? (
            data.lastArtworks.map((a) => (
              <ListRow
                key={a.id}
                href={`/admin/artworks/${a.id}`}
                title={a.title}
                subtitle={a.artistName}
                meta={formatRelativeTime(a.createdAt)}
                imageUrl={a.imageUrl}
              />
            ))
          ) : (
            <div className="px-2 text-xs text-muted-foreground">
              No artworks yet.
            </div>
          )}
        </div>
      </StatCard>

      <StatCard
        title="Artists"
        value={data?.artistsCount ?? "—"}
        subtitle="All artist profiles"
        icon={<MdOutlinePerson size={18} />}
        href="/admin/artists"
      >
        <div className="space-y-1">
          {data?.lastArtists?.length ? (
            data.lastArtists.map((a) => (
              <ListRow
                key={a.id}
                href={`/admin/artists/${a.id}`}
                title={a.name}
                meta={formatRelativeTime(a.createdAt)}
                imageUrl={a.avatarUrl}
              />
            ))
          ) : (
            <div className="px-2 text-xs text-muted-foreground">
              No artists yet.
            </div>
          )}
        </div>
      </StatCard>

      <StatCard
        title="New inquiries"
        value={data?.inquiriesNewCount ?? "—"}
        subtitle={clsx(
          "All inquiries: ",
          String(data?.inquiriesAllCount ?? "—"),
        )}
        icon={<MdOutlineMail size={18} />}
        href="/admin/inquiries?status=NEW"
      >
        <div className="space-y-1">
          {data?.latestNewInquiries?.length ? (
            data.latestNewInquiries.map((i) => (
              <ListRow
                key={i.id}
                href={`/admin/inquiries/${i.id}`}
                title={i.name}
                subtitle={i.regarding}
                meta={formatRelativeTime(i.createdAt)}
                imageUrl={null}
              />
            ))
          ) : (
            <div className="px-2 text-xs text-muted-foreground">
              No new inquiries.
            </div>
          )}
        </div>
      </StatCard>

      <StatCard
        title="Last inquiry"
        value={lastRelative}
        subtitle={data?.lastInquiryAt ? `Received: ${lastExact}` : "—"}
        icon={<MdAccessTime size={18} />}
        href="/admin/inquiries"
      >
        <div className="px-2 text-xs text-muted-foreground">
          Jump to Inbox to view the latest messages.
        </div>
      </StatCard>
    </div>
  );
}
