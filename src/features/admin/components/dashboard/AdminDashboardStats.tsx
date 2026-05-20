"use client";

import { formatCompactTime, formatRelativeTime } from "@/lib/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  MdAccessTime,
  MdOutlineCollections,
  MdOutlineMail,
  MdOutlinePerson,
} from "react-icons/md";
import { AdminDashboardStats as Stats } from "../../types";
import { ListRow } from "./ListRow";
import { StatCard } from "./StatCard";
import { StatCardSkeleton } from "./StatCardSkeleton";

type Props = {
  data?: Stats;
  isLoading?: boolean;
};

export function AdminDashboardStats({ data, isLoading }: Props) {
  const { t } = useTranslation();
  const lastRelative = useMemo(
    () => formatRelativeTime(data?.lastInquiryAt ?? null, t),
    [data?.lastInquiryAt, t],
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
        title={t("Artworks")}
        value={data?.artworksCount ?? "—"}
        subtitle={t("Total artworks in catalog")}
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
                meta={formatRelativeTime(a.createdAt, t)}
                imageUrl={a.imageUrl}
              />
            ))
          ) : (
            <div className="px-2 text-xs text-muted-foreground">
              {t("No artworks available yet.")}
            </div>
          )}
        </div>
      </StatCard>

      <StatCard
        title={t("Artists")}
        value={data?.artistsCount ?? "—"}
        subtitle={t("All artist profiles")}
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
                meta={formatRelativeTime(a.createdAt, t)}
                imageUrl={a.avatarUrl}
              />
            ))
          ) : (
            <div className="px-2 text-xs text-muted-foreground">
              {t("No artists available yet.")}
            </div>
          )}
        </div>
      </StatCard>

      <StatCard
        title={t("New inquiries")}
        value={data?.inquiriesNewCount ?? "—"}
        subtitle={t("All inquiries: {{count}}", {
          count: data?.inquiriesAllCount ?? "—",
        })}
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
                meta={formatRelativeTime(i.createdAt, t)}
                imageUrl={null}
              />
            ))
          ) : (
            <div className="px-2 text-xs text-muted-foreground">
              {t("No new inquiries.")}
            </div>
          )}
        </div>
      </StatCard>

      <StatCard
        title={t("Last inquiry")}
        value={lastRelative}
        subtitle={
          data?.lastInquiryAt
            ? t("Received: {{date}}", { date: lastExact })
            : "—"
        }
        icon={<MdAccessTime size={18} />}
        href="/admin/inquiries"
      >
        <div className="px-2 text-xs text-muted-foreground">
          {t("Jump to Inbox to view the latest messages.")}
        </div>
      </StatCard>
    </div>
  );
}
