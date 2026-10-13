"use client";

import { Button, Card, EnumSelectField, Spinner } from "@/components/ui";
import { useAdminMe } from "@/features/admin/hooks/useAdminMe";
import { useUpdateArtist } from "@/features/artists/hooks/useUpdateArtist";
import { Artist, UpdateArtistDTO } from "@/features/artists/types";
import {
  ItemStatus,
  ItemStatusLabels,
  ItemVisibility,
  ItemVisibilityLabels,
} from "@/types/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const publicationSchema = z.object({
  status: z.nativeEnum(ItemStatus),
  visibility: z.nativeEnum(ItemVisibility),
  isFeatured: z.boolean(),
});

type PublicationFormValues = z.infer<typeof publicationSchema>;

interface ArtistPublicationSettingsProps {
  artist: Artist;
}

export function ArtistPublicationSettings({
  artist,
}: ArtistPublicationSettingsProps) {
  const { t } = useTranslation();
  const { data: adminData } = useAdminMe();
  const updateArtist = useUpdateArtist({
    redirectOnSuccess: false,
  });

  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      status: artist.status,
      visibility: artist.visibility,
      isFeatured: artist.isFeatured,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const isBusy = isSubmitting || updateArtist.isPending;

  const { control, register, handleSubmit, reset } = form;

  useEffect(() => {
    reset({
      status: artist.status,
      visibility: artist.visibility,
      isFeatured: artist.isFeatured,
    });
  }, [artist.status, artist.visibility, artist.isFeatured, reset]);

  if (adminData?.user.role !== "ADMIN") {
    return null;
  }

  const onSubmit = (values: PublicationFormValues) => {
    const data: UpdateArtistDTO = values;
    updateArtist.mutate({ id: artist.id, data });
  };

  return (
    <Card className="space-y-5 p-4">
      <div>
        <h2 className="text-lg font-semibold">{t("Publication settings")}</h2>
        <p className="text-sm text-zinc-500">
          {t("Manage artist publication and visibility.")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex gap-4">
          <div className="w-1/2">
            <EnumSelectField<PublicationFormValues, ItemStatus>
              control={control}
              name="status"
              label={t("Status")}
              enumObject={ItemStatus}
              labels={ItemStatusLabels}
            />
          </div>

          <div className="w-1/2">
            <EnumSelectField<PublicationFormValues, ItemVisibility>
              control={control}
              name="visibility"
              label={t("Visibility")}
              enumObject={ItemVisibility}
              labels={ItemVisibilityLabels}
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            {...register("isFeatured")}
            className="h-4 w-4 shrink-0 accent-primary"
          />
          <span>{t("Featured artist — Show on homepage")}</span>
        </label>

        {updateArtist.error && (
          <p className="text-xs text-red-500">
            {t(updateArtist.error.message)}
          </p>
        )}

        <Button type="submit" disabled={isBusy}>
          {isBusy && <Spinner size="sm" className="mr-2" />}
          {isBusy ? t("Saving...") : t("Save settings")}
        </Button>
      </form>
    </Card>
  );
}
