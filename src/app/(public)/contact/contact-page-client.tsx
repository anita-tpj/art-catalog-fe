"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { TextInputField } from "@/components/ui";
import { TextareaField } from "@/components/ui";

import { artistsService } from "@/features/artists";
import { artworksService } from "@/features/artworks";
import { inquiriesService } from "@/features/inquiries";

type Props = {
  artworkId?: number;
  artistId?: number;
};

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  message: z
    .string()
    .min(10, "Message is too short")
    .max(4000, "Message is too long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactPageClient({ artworkId, artistId }: Props) {
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

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    reset,
  } = form;

  // Prefill message once (don’t overwrite user typing)
  useEffect(() => {
    if (!contextLine) return;

    const current = getValues("message");
    if (current.trim()) return;

    setValue(
      "message",
      `Hi,\n\nI’m interested in ${contextLine}.\nCould you share availability and pricing?\n\nThanks!`,
      { shouldDirty: false, shouldTouch: false, shouldValidate: false },
    );
  }, [contextLine, getValues, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await inquiriesService.create({
        ...values,
        artworkId,
        artistId,
      });

      setIsSuccess(true);

      // optional: clear for another message
      // reset({ name: "", email: "", message: "" });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setSubmitError(msg);
    }
  });

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Contact</h1>
        <p className="text-sm text-muted-foreground">
          Send an inquiry and we’ll get back to you.
        </p>
      </header>

      {contextLine ? (
        <Card className="rounded-2xl p-4">
          <div className="text-sm font-medium">Regarding</div>
          <div className="text-sm text-muted-foreground">{contextLine}</div>

          <div className="mt-2">
            <Link
              className="inline-flex items-center gap-1 text-sm underline underline-offset-4"
              href={backHref}
            >
              View related page
              <MdArrowForward />
            </Link>
          </div>
        </Card>
      ) : null}

      {isSuccess ? (
        <Card className="rounded-2xl p-6">
          <div className="text-lg font-semibold">Inquiry sent ✅</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Thanks! We received your message and will get back to you soon.
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline">
              <Link href={backHref} className="inline-flex items-center gap-1">
                <MdArrowBack />
                Back
              </Link>
            </Button>

            <Button asChild>
              <Link href="/artworks">Browse artworks</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="rounded-2xl p-6">
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <TextInputField
              label="Name"
              placeholder="Your name"
              error={errors.name?.message}
              disabled={isSubmitting}
              {...register("name")}
            />

            <TextInputField
              label="Email"
              placeholder="you@example.com"
              type="email"
              error={errors.email?.message}
              disabled={isSubmitting}
              {...register("email")}
            />

            <TextareaField
              label="Message"
              placeholder="Write your message…"
              rows={6}
              error={errors.message?.message}
              disabled={isSubmitting}
              {...register("message")}
            />

            {submitError ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
                {submitError}
              </div>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send inquiry"}
              </Button>

              <p className="text-xs text-muted-foreground">
                By sending this inquiry, you agree we may contact you back via
                email.
              </p>
            </div>
          </form>
        </Card>
      )}
    </section>
  );
}
