"use client";

import {
  BooleanRadioField,
  Button,
  CancelButton,
  Card,
  EnumSelectField,
  Spinner,
  TextareaField,
  TextInputField,
  YearSelector,
} from "@/components/ui";
import { ArtistSelector } from "@/components/ui/artist-selector";
import {
  ArtworkFieldKey,
  CATEGORY_FIELD_CONFIG,
} from "@/config/artwork-category-field-config";

import {
  ArtworkAvailability,
  ArtworkAvailabilityLabels,
  ArtworkCategory,
  ArtworkCategoryLabels,
  ArtworkMotive,
  ArtworkMotiveLabels,
  ArtworkOrientation,
  ArtworkOrientationLabels,
  ArtworkOrigin,
  ArtworkOriginLabels,
  ArtworkStyle,
  ArtworkStyleLabels,
  ArtworkTechnique,
  ArtworkTechniqueLabels,
  CreateArtworkDTO,
} from "../../types";

import { ItemStatus, ItemStatusLabels } from "@/types/item";

import { ImageUploadField } from "@/components/ui";
import { useAdminMe } from "@/features/admin/hooks/useAdminMe";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useArtworkImageUpload } from "../../hooks/useArtworkImageUpload";

interface ArtworkFormLayoutProps {
  form: UseFormReturn<CreateArtworkDTO>;
  onSubmit: (values: CreateArtworkDTO) => void;
  title: string;
  subtitle?: string;
  submitLabel: string;
  isBusy?: boolean;
  apiError?: string;
  isEdit?: boolean;
}

export function ArtworkFormLayout({
  form,
  onSubmit,
  title,
  subtitle,
  submitLabel,
  isBusy = false,
  apiError,
  isEdit = false,
}: ArtworkFormLayoutProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const category = form.watch("category");
  const config = CATEGORY_FIELD_CONFIG[category];
  const show = (k: ArtworkFieldKey) => config?.visible.includes(k);
  const isReq = (k: ArtworkFieldKey) => config?.required.includes(k);

  const { uploading, error, uploadFile } = useArtworkImageUpload();
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
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,57fr)_minmax(0,43fr)] lg:divide-x lg:divide-zinc-300">
            <div className="space-y-6 lg:pr-5">
              <div className="space-y-4">
                <TextInputField
                  label={`${t("Title")} *`}
                  placeholder={t("Type title")}
                  error={
                    errors.title?.message ? t(errors.title.message) : undefined
                  }
                  {...register("title")}
                />

                <div className="grid gap-4 lg:grid-cols-2">
                  {isAdmin && (
                    <ArtistSelector<CreateArtworkDTO>
                      control={control}
                      name="artistId"
                      label={`${t("Artist")} *`}
                    />
                  )}

                  <EnumSelectField<CreateArtworkDTO, ArtworkCategory>
                    control={control}
                    name="category"
                    label={`${t("Category")} *`}
                    placeholder={t("Select category")}
                    enumObject={ArtworkCategory}
                    labels={ArtworkCategoryLabels}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t("Artistic details")}
                </h2>

                <div className="max-w-sm">
                  <EnumSelectField<CreateArtworkDTO, ArtworkOrigin>
                    control={control}
                    name="origin"
                    label={`${t("Artwork origin")} *`}
                    placeholder={t("Select artwork origin")}
                    enumObject={ArtworkOrigin}
                    labels={ArtworkOriginLabels}
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {show("medium") && (
                    <TextInputField
                      label={t("Medium")}
                      placeholder={t(
                        "e.g. Oil on canvas, bronze, porcelain, wool and cotton",
                      )}
                      error={
                        errors.medium?.message
                          ? t(errors.medium.message)
                          : undefined
                      }
                      {...register("medium")}
                    />
                  )}
                  {show("technique") && (
                    <EnumSelectField<CreateArtworkDTO, ArtworkTechnique>
                      control={control}
                      name="technique"
                      //label={`Technique${isReq("technique") ? " *" : ""}`}
                      label={t("Technique")}
                      placeholder={t("Select technique")}
                      enumObject={ArtworkTechnique}
                      labels={ArtworkTechniqueLabels}
                      sortOptions
                    />
                  )}

                  {show("style") && (
                    <EnumSelectField<CreateArtworkDTO, ArtworkStyle>
                      control={control}
                      name="style"
                      label={t("Style")}
                      placeholder={t("Select style")}
                      enumObject={ArtworkStyle}
                      labels={ArtworkStyleLabels}
                      sortOptions
                    />
                  )}

                  {show("motive") && (
                    <EnumSelectField<CreateArtworkDTO, ArtworkMotive>
                      control={control}
                      name="motive"
                      label={t("Motive")}
                      placeholder={t("Select motive")}
                      enumObject={ArtworkMotive}
                      labels={ArtworkMotiveLabels}
                      sortOptions
                    />
                  )}

                  {show("orientation") && (
                    <EnumSelectField<CreateArtworkDTO, ArtworkOrientation>
                      control={control}
                      name="orientation"
                      label={t("Orientation")}
                      placeholder={t("Select orientation")}
                      enumObject={ArtworkOrientation}
                      labels={ArtworkOrientationLabels}
                    />
                  )}

                  {show("size") && (
                    <TextInputField
                      label={t("Size")}
                      placeholder={t("e.g. 50 × 70 cm or 30 × 30 × 45 cm")}
                      error={
                        errors.size?.message
                          ? t(errors.size.message)
                          : undefined
                      }
                      {...register("size")}
                    />
                  )}

                  {show("framed") && (
                    <BooleanRadioField<CreateArtworkDTO>
                      control={control}
                      name="framed"
                      label={t("Framed")}
                      trueLabel={t("Yes")}
                      falseLabel={t("No")}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="space-y-4">
                <ImageUploadField
                  control={control}
                  setValue={setValue}
                  imgUrl={"imageUrl"}
                  imgPublicId={"imagePublicId"}
                  label={`${t("Artwork image")} *`}
                  buttonLabel={t("Upload image")}
                  helperText={t(
                    "Recommended: at least 1200 px on the longest side. JPG, PNG or WebP, max 5 MB.",
                  )}
                  variant="preview"
                  previewHeight={160}
                  onUpload={uploadFile}
                  uploading={uploading}
                  uploadError={error}
                  onClear={() => {
                    setValue("imageUrl", "" as any, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    setValue("imagePublicId", "" as any, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                />
                <TextareaField
                  label={`${t("Description")} *`}
                  placeholder={t("Type description")}
                  rows={4}
                  error={
                    errors.description?.message
                      ? t(errors.description.message)
                      : undefined
                  }
                  {...register("description")}
                />
              </div>
              <div className="space-y-4">
                <div className="w-1/2">
                  <YearSelector<CreateArtworkDTO>
                    control={control}
                    name="year"
                    label={`${t("Year")} *`}
                    placeholder={t("Select year")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8 pt-2 border-t border-zinc-300">
                  <EnumSelectField<CreateArtworkDTO, ArtworkAvailability>
                    control={control}
                    name="availability"
                    label={t("Availability")}
                    enumObject={ArtworkAvailability}
                    labels={ArtworkAvailabilityLabels}
                  />
                  <EnumSelectField<CreateArtworkDTO, ItemStatus>
                    control={control}
                    name="status"
                    label={t("Status")}
                    enumObject={ItemStatus}
                    labels={ItemStatusLabels}
                  />
                </div>
              </div>
            </div>
          </div>

          {!isEdit && (
            <div className="space-y-2 border-t border-zinc-300 pt-4 dark:border-zinc-700">
              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  {...register("copyrightConfirmed")}
                  className="mt-1 h-4 w-4 shrink-0 accent-primary"
                />
                <span>
                  {t(
                    "I confirm that I am the creator of this artwork or have the necessary rights and permissions to publish it on ArtCatalog.",
                  )}
                  {" *"}
                </span>
              </label>

              {errors.copyrightConfirmed?.message && (
                <p className="text-xs text-red-500">
                  {t(errors.copyrightConfirmed.message)}
                </p>
              )}
            </div>
          )}

          {apiError && (
            <p className="text-xs text-red-500">
              {apiError || t("Failed to save artwork.")}
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
