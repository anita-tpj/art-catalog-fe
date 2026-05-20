"use client";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useArtists } from "@/features/artists/hooks/useArtists";
import { Artist } from "@/features/artists/types";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

type ArtistSelectorProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
};

export function ArtistSelector<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: ArtistSelectorProps<TFieldValues>) {
  const { t } = useTranslation();

  const { data: artists = [], isLoading, isError } = useArtists();

  const effectivePlaceholder = isLoading
    ? t("Loading artists...")
    : isError
      ? t("Error loading artists")
      : artists.length === 0
        ? t("No artists available yet")
        : (placeholder ?? t("Select artist"));

  const isDisabled = isLoading || isError || artists.length === 0;

  return (
    <div className="space-y-1">
      <Label>{label ?? t("Artist")}</Label>

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <div className="space-y-1">
            <Select
              key={field.value ?? "empty"}
              value={field.value ? String(field.value) : ""}
              onValueChange={(value) => field.onChange(Number(value))}
              disabled={isDisabled}
            >
              <SelectTrigger>
                <SelectValue placeholder={effectivePlaceholder} />
              </SelectTrigger>

              <SelectContent>
                {artists.map((artist: Artist) => (
                  <SelectItem key={artist.id} value={String(artist.id)}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldState.error?.message && (
              <p className="text-xs text-red-500">
                {t(fieldState.error.message)}
              </p>
            )}

            {!isLoading && !isError && artists.length === 0 && (
              <p className="text-xs text-zinc-500">
                {t("No artists available yet. Add an artist first.")}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
