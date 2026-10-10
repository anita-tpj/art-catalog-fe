"use client";

import {
  Button,
  CancelButton,
  Card,
  CountrySelector,
  EnumSelectField,
  Spinner,
  TextareaField,
  TextInputField,
  YearSelector,
} from "@/components/ui";
import {
  ArtworkCategory,
  ArtworkCategoryLabels,
} from "@/features/artworks/types";
import { useCountryOptions } from "@/hooks/useCountries";

import { ImageUploadField } from "@/components/ui";
import { useAdminMe } from "@/features/admin/hooks/useAdminMe";
import {
  ItemStatus,
  ItemStatusLabels,
  ItemVisibility,
  ItemVisibilityLabels,
} from "@/types/item";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
  slugLocked?: boolean;
}

export function ArtistFormLayout({
  form,
  onSubmit,
  title,
  subtitle,
  submitLabel,
  isBusy = false,
  apiError,
  slugLocked = false,
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
  const { t } = useTranslation();

  const { data: adminData } = useAdminMe();
  const isAdmin = adminData?.user.role === "ADMIN";

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
          onSubmit={handleSubmit((values) => {
            if (!isAdmin) {
              const data = { ...values };
              delete data.isFeatured;
              onSubmit(data);
              return;
            }

            onSubmit(values);
          })}
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
                label={`${t("Profile image")} *`}
                buttonLabel={t("Upload image")}
                helperText={t(
                  "Recommended: square image, 1200 × 1200 px. JPG, PNG or WebP, max 5 MB.",
                )}
                variant="avatar"
                onUpload={uploadFile}
                uploading={uploading}
                uploadError={error}
                onClear={() => {
                  setValue("avatarUrl", "" as any, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });

                  setValue("avatarPublicId", "" as any, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
              {/* Name */}
              <TextInputField
                label={`${t("Name")} *`}
                placeholder={t("Type name")}
                error={
                  errors.name?.message ? t(errors.name.message) : undefined
                }
                {...register("name")}
              />
              <div className="flex gap-4">
                {/* Country */}
                <div className="space-y-1 w-1/2">
                  <CountrySelector<CreateArtistDTO>
                    control={control}
                    name="country"
                    label={`${t("Country")} *`}
                    placeholder={t("Select country")}
                    options={countryOptions}
                  />
                </div>
                {/* Artist primary category */}
                <div className="space-y-1 w-1/2">
                  <EnumSelectField<CreateArtistDTO, ArtworkCategory>
                    control={control}
                    name="primaryCategory"
                    label={`${t("Primary category")} *`}
                    placeholder={t("Select category")}
                    enumObject={ArtworkCategory}
                    labels={ArtworkCategoryLabels}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Bio */}
              <TextareaField
                label={`${t("Bio")} *`}
                placeholder={t("Type bio")}
                rows={4}
                error={errors.bio?.message ? t(errors.bio.message) : undefined}
                {...register("bio")}
              />
              <div className="flex gap-4">
                {/* Birth Year */}
                <div className="w-1/2">
                  <YearSelector<CreateArtistDTO>
                    control={control}
                    name="birthYear"
                    label={`${t("Year of birth")} *`}
                    placeholder={t("Select year")}
                  />
                </div>
                {/* Death Year */}
                <div className="w-1/2">
                  <YearSelector<CreateArtistDTO>
                    control={control}
                    name="deathYear"
                    label={t("Year of death")}
                    placeholder={t("Select year")}
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8 pt-2 border-t border-zinc-300">
                {/* Public profile slug */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    {t("Public profile URL")} *
                  </label>

                  <div className="flex items-center">
                    <span className="shrink-0 text-sm text-zinc-500">
                      creativeatlas.co/
                    </span>

                    <input
                      type="text"
                      placeholder={t("choose-your-url")}
                      disabled={slugLocked}
                      {...register("slug")}
                      className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-700 dark:disabled:bg-zinc-800"
                    />
                  </div>

                  {errors.slug?.message ? (
                    <p className="text-xs text-red-500">
                      {t(errors.slug.message)}
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-500">
                      {slugLocked
                        ? t(
                            "This URL is locked because the profile has already been published.",
                          )
                        : t(
                            "Choose your public profile URL. You can change it until the profile is published.",
                          )}
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  {/* Artist visibility */}
                  <div className="space-y-1 w-1/2">
                    <EnumSelectField<CreateArtistDTO, ItemVisibility>
                      control={control}
                      name="visibility"
                      label={t("Visibility")}
                      enumObject={ItemVisibility}
                      labels={ItemVisibilityLabels}
                    />
                  </div>
                  {/* Artist status */}
                  <div className="space-y-1 w-1/2">
                    <EnumSelectField<CreateArtistDTO, ItemStatus>
                      control={control}
                      name="status"
                      label={t("Status")}
                      enumObject={ItemStatus}
                      labels={ItemStatusLabels}
                    />
                  </div>
                </div>
                {isAdmin && (
                  <label className="flex items-center gap-3 pt-3 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isFeatured")}
                      className="h-4 w-4 shrink-0 accent-primary"
                    />
                    <span>{t("Featured artist — Show on homepage")}</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {apiError && (
            <p className="text-xs text-red-500">
              {apiError || t("Failed to save artist.")}
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
