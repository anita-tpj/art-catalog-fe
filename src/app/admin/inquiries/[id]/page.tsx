import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { Inquiry } from "@/services/inquiries";
import { InquiryDetailClient } from "./inquiry-detail-client";
import { MdArrowBack } from "react-icons/md";

export const dynamic = "force-dynamic"; // admin → always fresh

type PageProps = { params: Promise<{ id: string }> };

function getApiBaseUrlOrThrow() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  return base;
}

function parseIdOrNotFound(idParam: string) {
  const id = Number(idParam);
  if (!Number.isFinite(id) || id <= 0) notFound();
  return id;
}

async function fetchInquiryOrNull(id: number): Promise<Inquiry | null> {
  const apiBase = getApiBaseUrlOrThrow();

  const res = await fetch(`${apiBase}/api/inquiries/${id}`, {
    cache: "no-store",
    headers: { accept: "application/json" },
  });

  if (!res.ok) return null;
  return (await res.json()) as Inquiry;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) return { title: "Inquiry not found" };

  const inquiry = await fetchInquiryOrNull(id);
  if (!inquiry) return { title: "Inquiry not found" };

  return {
    title: `Inquiry #${inquiry.id} — ${inquiry.name}`,
    description: `Inquiry from ${inquiry.email}`,
    alternates: { canonical: `/admin/inquiries/${inquiry.id}` },
  };
}

export default async function InquiryDetailPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = parseIdOrNotFound(idParam);

  const inquiry = await fetchInquiryOrNull(id);
  if (!inquiry) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
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
