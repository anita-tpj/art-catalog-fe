"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { z } from "zod";

import { Button, Card, TextareaField, TextInputField } from "@/components/ui";

import { artistsService } from "@/features/artists";
import { artworksService } from "@/features/artworks";
import { inquiriesService } from "@/features/inquiries";
import { useTranslation } from "react-i18next";

type Props = {
  artworkId?: number;
  artistId?: number;
};

const contactSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t("Name is required"))
      .max(120, t("Name is too long")),
    email: z
      .string()
      .min(1, t("Email is required"))
      .email(t("Enter a valid email")),
    message: z
      .string()
      .min(10, t("Message is too short"))
      .max(4000, t("Message is too long")),
  });

type ContactFormValues = z.infer<ReturnType<typeof contactSchema>>;

export function ContactPageClient({ artworkId, artistId }: Props) {
  const { t } = useTranslation();
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

  const schema = contactSchema(t);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
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
          : t("Something went wrong. Please try again.");
      setSubmitError(msg);
    }
  });

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">{t("Contact")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("Send an inquiry and we'll get back to you.")}
        </p>
      </header>

      {contextLine ? (
        <Card className="rounded-2xl p-4">
          <div className="text-sm font-medium">{t("Regarding")}</div>
          <div className="text-sm text-muted-foreground">{contextLine}</div>

          <div className="mt-2">
            <Link
              className="inline-flex items-center gap-1 text-sm underline underline-offset-4"
              href={backHref}
            >
              {t("View related page")}
              <MdArrowForward />
            </Link>
          </div>
        </Card>
      ) : null}

      {isSuccess ? (
        <Card className="rounded-2xl p-6">
          <div className="text-lg font-semibold">{t("Inquiry sent")} ✅</div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              "Thanks! We received your message and will get back to you soon.",
            )}
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline">
              <Link href={backHref} className="inline-flex items-center gap-1">
                <MdArrowBack />
                {t("Back")}
              </Link>
            </Button>

            <Button asChild>
              <Link href="/artworks">{t("Browse artworks")}</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="rounded-2xl p-6">
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <TextInputField
              label={t("Name")}
              placeholder={t("Your name")}
              error={errors.name?.message}
              disabled={isSubmitting}
              {...register("name")}
            />

            <TextInputField
              label={t("Email")}
              placeholder={t("you@example.com")}
              type="email"
              error={errors.email?.message}
              disabled={isSubmitting}
              {...register("email")}
            />

            <TextareaField
              label={t("Message")}
              placeholder={t("Write your message…")}
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
                {isSubmitting ? t("Sending…") : t("Send inquiry")}
              </Button>

              <p className="text-xs text-muted-foreground">
                {t(
                  "By sending this inquiry, you agree we may contact you back via email.",
                )}
              </p>
            </div>
          </form>
        </Card>
      )}
    </section>
  );
}
