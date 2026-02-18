import type { Metadata } from "next";
import { InquiriesPageClient } from "./inquiries-page-client";
import { toPositiveInt } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export const metadata: Metadata = {
  title: "Admin — Inquiries",
  description: "Manage inquiries.",
};

export default async function AdminInquiriesPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const initialSearch = sp.search ?? "";
  const initialStatus = sp.status ?? "ALL";
  const initialPage = toPositiveInt(sp.page, 1);
  const initialPageSize = toPositiveInt(sp.pageSize, 20);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <InquiriesPageClient
        initialSearch={initialSearch}
        initialStatus={initialStatus}
        initialPage={initialPage}
        initialPageSize={initialPageSize}
      />
    </main>
  );
}
