import { Inquiry } from "@/features/inquiries/types";
import { API_BASE_URL } from "@/lib/config";
import { parseIdOrNotFound } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import { InquiryDetailClient } from "./inquiry-detail-client";

export const dynamic = "force-dynamic"; // admin → always fresh

type PageProps = { params: Promise<{ id: string }> };

async function fetchInquiryOrNull(id: number): Promise<Inquiry | null> {
  const apiBase = API_BASE_URL;

  const res = await fetch(`${apiBase}/api/inquiries/${id}`, {
    cache: "no-store",
    headers: { accept: "application/json" },
  });

  if (!res.ok) return null;
  return (await res.json()) as Inquiry;
}

export default async function InquiryDetailPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = parseIdOrNotFound(idParam);

  const inquiry = await fetchInquiryOrNull(id);
  if (!inquiry) notFound();

  return (
    <main className="space-y-4">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href="/admin/inquiries"
          className="text-sm underline underline-offset-4 flex items-center gap-0.5"
        >
          <MdArrowBack />
          Back to inbox
        </Link>

        <div className="text-xs text-muted-foreground">
          Inquiry #{inquiry.id}
        </div>
      </div>

      <InquiryDetailClient initialInquiry={inquiry} />
    </main>
  );
}
