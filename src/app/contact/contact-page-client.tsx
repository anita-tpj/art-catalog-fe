"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { artworksService } from "@/services/artworks";
import { artistsService } from "@/services/artists";
import { inquiriesService } from "@/services/inquiries";
import { Button } from "@/components/ui/button";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

type Props = {
  artworkId?: number;
  artistId?: number;
};

export function ContactPageClient({ artworkId, artistId }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: artwork } = useQuery({
    queryKey: ["contact-artwork", artworkId],
    queryFn: () => artworksService.getOne(artworkId as number),
    enabled: !!artworkId,
  });

  const { data: artist } = useQuery({
    queryKey: ["contact-artist", artistId],
    queryFn: () => artistsService.getOne(artistId as number),
    enabled: !!artistId,
  });

  const contextLine = useMemo(() => {
    if (artworkId && artwork)
      return `Artwork: "${artwork.title}" (ID ${artworkId})`;
    if (artistId && artist) return `Artist: ${artist.name} (ID ${artistId})`;
    if (artworkId) return `Artwork ID ${artworkId}`;
    if (artistId) return `Artist ID ${artistId}`;
    return null;
  }, [artworkId, artistId, artwork, artist]);

  const backHref = artworkId
    ? `/artworks/${artworkId}`
    : artistId
      ? `/artists/${artistId}`
      : "/";

  // Prefill message once (don’t overwrite user typing)
  useEffect(() => {
    if (!contextLine) return;
    setMessage((prev) => {
      if (prev.trim()) return prev;
      return `Hi,\n\nI’m interested in ${contextLine}.\nCould you share availability and pricing?\n\nThanks!`;
    });
  }, [contextLine]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await inquiriesService.create({
        name,
        email,
        message,
        artworkId,
        artistId,
      });

      setIsSuccess(true);
      // optional: clear fields
      // setName(""); setEmail(""); setMessage("");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Contact</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Send an inquiry and we’ll get back to you.
        </p>

        {contextLine ? (
          <div className="mt-4 rounded-2xl border p-4 text-sm">
            <div className="font-medium">Regarding</div>
            <div className="text-muted-foreground">{contextLine}</div>

            <div className="mt-2">
              <Link
                className="text-sm underline underline-offset-4 flex items-center gap-0.5"
                href={backHref}
              >
                View related page
                <MdArrowForward />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {isSuccess ? (
        <div className="rounded-2xl border p-6">
          <div className="text-lg font-semibold">Inquiry sent ✅</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Thanks! We received your message and will get back to you soon.
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline">
              <Link
                href={backHref}
                className="inline-flex h-10 items-center gap-0.5 justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
              >
                <MdArrowBack />
                Back
              </Link>
            </Button>

            <Button asChild>
              <Link
                href="/artworks"
                className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium"
              >
                Browse artworks
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border p-6">
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <input
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Message</label>
            <textarea
              className="min-h-[140px] w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {submitError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
              {submitError}
            </div>
          ) : null}

          <Button disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send inquiry"}
          </Button>

          <p className="text-xs text-muted-foreground">
            By sending this inquiry, you agree we may contact you back via
            email.
          </p>
        </form>
      )}
    </>
  );
}
