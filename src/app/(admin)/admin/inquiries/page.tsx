import { toPositiveInt } from "@/lib/utils";
import { InquiriesPageClient } from "./inquiries-page-client";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AdminInquiriesPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const initialSearch = sp.search ?? "";
  const initialStatus = sp.status ?? "ALL";
  const initialPage = toPositiveInt(sp.page, 1);
  const initialPageSize = toPositiveInt(sp.pageSize, 20);

  return (
    <main className="space-y-4">
      <InquiriesPageClient
        initialSearch={initialSearch}
        initialStatus={initialStatus}
        initialPage={initialPage}
        initialPageSize={initialPageSize}
      />
    </main>
  );
}
