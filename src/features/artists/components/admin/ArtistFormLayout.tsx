"use client";

import { Button } from "@/components/ui";
import { CancelButton } from "@/components/ui";
import { Card } from "@/components/ui";
import { CountrySelector } from "@/components/ui";
import { EnumSelectField } from "@/components/ui";
import { Spinner } from "@/components/ui";
import { TextInputField } from "@/components/ui";
import { TextareaField } from "@/components/ui";
import { YearSelector } from "@/components/ui";
import {
  ArtworkCategory,
  ArtworkCategoryLabels,
} from "@/features/artworks/types";
import { useCountryOptions } from "@/hooks/useCountries";

import { ImageUploadField } from "@/components/ui";
import { UseFormReturn } from "react-hook-form";
import { useArtistAvatarUpload } from "../../hooks/useArtistAvatarUpload";
import { CreateArtistDTO } from "../../types";

interface ArtistFormLayoutProps {
  form: UseFormReturn<CreateArtistDTO>;
  onSubmit: (values: CreateArtistDTO) => void;
  title: string;
  subtitle?: string;
  submitLabel: string;
  isBusy?: boolean;
  apiError?: string;
}

export function ArtistFormLayout({
  form,
  onSubmit,
  title,
  subtitle,
  submitLabel,
  isBusy = false,
  apiError,
}: ArtistFormLayoutProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const countryOptions = useCountryOptions();
  const { uploading, error, uploadFile } = useArtistAvatarUpload();

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        )}
      </div>

      <Card className="border border-dashed border-zinc-300 p-4 text-sm dark:border-zinc-700">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,57fr)_minmax(0,43fr)] lg:divide-x lg:divide-zinc-300">
            <div className="space-y-6 lg:pr-5">
              {/* Avatar upload */}
              <ImageUploadField
                control={control}
                setValue={setValue}
                imgUrl={"avatarUrl"}
                imgPublicId={"avatarPublicId"}
                label="Avatar"
                buttonLabel="Upload avatar"
                variant="avatar"
                onUpload={uploadFile}
                uploading={uploading}
                uploadError={error}
                onClear={() => {
                  setValue("avatarUrl", "" as any, { shouldDirty: true });
                  setValue("avatarPublicId", "" as any, { shouldDirty: true });
                }}
              />
              {/* Name */}
              <TextInputField
                label="Name"
                placeholder="Type name"
                error={errors.name?.message}
                {...register("name")}
              />
              <div className="flex gap-4">
                {/* Country */}
                <div className="space-y-1 w-1/2">
                  <CountrySelector<CreateArtistDTO>
                    control={control}
                    name="country"
                    label="Country"
                    placeholder="Select country"
                    options={countryOptions}
                  />
                </div>
                {/* Artist primary category */}
                <div className="space-y-1 w-1/2">
                  <EnumSelectField<CreateArtistDTO, ArtworkCategory>
                    control={control}
                    name="primaryCategory"
                    label="Primary category"
                    placeholder="Select category"
                    enumObject={ArtworkCategory}
                    labels={ArtworkCategoryLabels}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Bio */}
              <TextareaField
                label="Bio"
                placeholder="Type bio"
                rows={4}
                error={errors.bio?.message}
                {...register("bio")}
              />
              <div className="flex gap-4">
                {/* Birth Year */}
                <div className="w-1/2">
                  <YearSelector<CreateArtistDTO>
                    control={control}
                    name="birthYear"
                    label="Year of birth"
                    placeholder="Select year"
                  />
                </div>
                {/* Death Year */}
                <div className="w-1/2">
                  <YearSelector<CreateArtistDTO>
                    control={control}
                    name="deathYear"
                    label="Year of death"
                    placeholder="Select year"
                  />
                </div>
              </div>
            </div>
          </div>

          {apiError && (
            <p className="text-xs text-red-500">
              {apiError || "Failed to save artist."}
            </p>
          )}

          <div className="pt-2 flex gap-4">
            <Button type="submit" disabled={isBusy}>
              {isBusy && <Spinner size="sm" className="mr-2" />}
              {submitLabel}
            </Button>
            <CancelButton back />
          </div>
        </form>
      </Card>
    </section>
  );
}
