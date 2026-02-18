"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import type { Inquiry, InquiryStatus } from "@/services/inquiries";
import { Button } from "@/components/ui/button";
import {
  MdArrowForward,
  MdOutlineArchive,
  MdOutlineMarkEmailUnread,
  MdOutlineReply,
  MdOutlineContentCopy,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { useUpdateInquiryStatus } from "@/hooks/inquiries/useUpdateStatusInquiryStatus";
import toast from "react-hot-toast";

type Props = {
  initialInquiry: Inquiry;
};

function formatRegarding(i: Inquiry) {
  if (i.artwork) return `Artwork: ${i.artwork.title}`;
  if (i.artist) return `Artist: ${i.artist.name}`;
  if (i.artworkId) return `Artwork ID: ${i.artworkId}`;
  if (i.artistId) return `Artist ID: ${i.artistId}`;
  return "—";
}

function buildMailto(inquiry: Inquiry, regarding: string, created: string) {
  const subject = encodeURIComponent(
    `Re: ArtCatalog inquiry${
      regarding && regarding !== "—" ? ` — ${regarding}` : ""
    }`,
  );

  const body = encodeURIComponent(
    `Hi ${inquiry.name},\n\n` +
      `Thanks for reaching out!\n\n` +
      `---\n` +
      `Original inquiry (${created})\n` +
      `Regarding: ${regarding}\n` +
      `From: ${inquiry.name} <${inquiry.email}>\n\n` +
      `${inquiry.message}\n`,
  );

  return `mailto:${inquiry.email}?subject=${subject}&body=${body}`;
}

export function InquiryDetailClient({ initialInquiry }: Props) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry>(initialInquiry);

  const { mutateAsync: updateStatus, isPending } = useUpdateInquiryStatus();

  const regarding = useMemo(() => formatRegarding(inquiry), [inquiry]);

  const created = useMemo(() => {
    try {
      return new Date(inquiry.createdAt).toLocaleString();
    } catch {
      return String(inquiry.createdAt);
    }
  }, [inquiry.createdAt]);

  const statusPill =
    inquiry.status === "NEW"
      ? "border-primary/30 bg-primary/10 text-primary"
      : "text-muted-foreground";

  async function setStatus(next: InquiryStatus) {
    await updateStatus({ id: inquiry.id, status: next });
    setInquiry((prev) => ({ ...prev, status: next }));
  }

  // auto mark READ if NEW
  useEffect(() => {
    if (inquiry.status !== "NEW") return;

    updateStatus({ id: inquiry.id, status: "READ" })
      .then(() => setInquiry((prev) => ({ ...prev, status: "READ" })))
      .catch(() => {});
  }, [inquiry.id, inquiry.status, updateStatus]);

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT */}
        <section className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2 py-0.5 text-xs ${statusPill}`}
              >
                {inquiry.status}
              </span>

              <div className="text-sm font-medium">{inquiry.name}</div>
              <div className="text-xs text-muted-foreground">
                {inquiry.email}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 justify-end ml-auto">
                {/* Reply */}
                <a
                  href={buildMailto(inquiry, regarding, created)}
                  className="inline-flex"
                  title="Reply"
                >
                  <Button type="button" variant="link" size="xs">
                    <MdOutlineReply size="20" />
                  </Button>
                </a>

                {/* Copy email */}
                <Button
                  variant="link"
                  size="xs"
                  title="Copy"
                  onClick={async () => {
                    navigator.clipboard.writeText(inquiry.email);
                    try {
                      await navigator.clipboard.writeText(inquiry.email);
                      toast.success("Email copied");
                    } catch {
                      toast.error("Couldn’t copy email");
                    }
                  }}
                >
                  <MdOutlineContentCopy size="20" />
                </Button>

                {/* Mark unread */}
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  title="Mark unread"
                  onClick={async () => {
                    await setStatus("NEW");
                    router.push("/admin/inquiries");
                    router.refresh();
                    toast.success("Marked as unread");
                  }}
                >
                  <MdOutlineMarkEmailUnread size="20" />
                </Button>

                {/* Archive */}
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  title="Archive"
                  disabled={isPending || inquiry.status === "ARCHIVED"}
                  onClick={async () => {
                    await setStatus("ARCHIVED");
                    router.push("/admin/inquiries");
                    router.refresh();
                    toast.success("Marked as archived");
                  }}
                >
                  <MdOutlineArchive size="20" />
                </Button>
              </div>
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              {regarding} • {created}
            </div>

            <div className="mt-4 whitespace-pre-wrap text-sm leading-6">
              {inquiry.message}
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border p-5 space-y-2">
            <div className="text-sm font-medium">Related</div>

            {inquiry.artworkId && (
              <Link
                className="text-sm underline underline-offset-4 flex items-center gap-0.5"
                href={`/artworks/${inquiry.artworkId}`}
              >
                View artwork
                <MdArrowForward />
              </Link>
            )}

            {inquiry.artistId && (
              <Link
                className="text-sm underline underline-offset-4 flex items-center gap-0.5"
                href={`/artists/${inquiry.artistId}`}
              >
                View artist
                <MdArrowForward />
              </Link>
            )}

            <div className="pt-2 text-xs text-muted-foreground">
              Tip: Opening a NEW inquiry auto-marks it as READ.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
