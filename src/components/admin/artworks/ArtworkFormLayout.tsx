"use client";

import { ArtistSelector } from "@/components/ui/artist-selector";
import { BooleanRadioField } from "@/components/ui/boolean-radio-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EnumSelectField } from "@/components/ui/enum-select-field";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import { Spinner } from "@/components/ui/spinner";
import { TextInputField } from "@/components/ui/text-input-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { YearSelector } from "@/components/ui/year-selector";

import {
  ArtworkCategory,
  ArtworkCategoryLabels,
  ArtworkMotive,
  ArtworkMotiveLabels,
  ArtworkOrientation,
  ArtworkOrientationLabels,
  ArtworkStandardSize,
  ArtworkStandardSizeLabels,
  ArtworkStyle,
  ArtworkStyleLabels,
  ArtworkTechnique,
  ArtworkTechniqueLabels,
  CreateArtworkDTO,
} from "@/services/artworks";

import { UseFormReturn } from "react-hook-form";

interface ArtworkFormLayoutProps {
  form: UseFormReturn<CreateArtworkDTO>;
  onSubmit: (values: CreateArtworkDTO) => void;
  title: string;
  subtitle?: string;
  submitLabel: string;
  isBusy?: boolean;
  apiError?: string;
}

export function ArtworkFormLayout({
  form,
  onSubmit,
  title,
  subtitle,
  submitLabel,
  isBusy = false,
  apiError,
}: ArtworkFormLayoutProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

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
            <div className="space-y-6 pr-5">
              <div className="space-y-4">
                <TextInputField
                  label="Title"
                  placeholder="Type title"
                  error={errors.title?.message}
                  {...register("title")}
                />

                <div className="grid gap-4 lg:grid-cols-2">
                  <ArtistSelector<CreateArtworkDTO>
                    control={control}
                    name="artistId"
                    label="Artist"
                  />

                  <EnumSelectField<CreateArtworkDTO, ArtworkCategory>
                    control={control}
                    name="category"
                    label="Category"
                    placeholder="Select category"
                    enumObject={ArtworkCategory}
                    labels={ArtworkCategoryLabels}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Artistic details
                </h2>

                <div className="grid gap-4 lg:grid-cols-2">
                  <EnumSelectField<CreateArtworkDTO, ArtworkTechnique>
                    control={control}
                    name="technique"
                    label="Technique"
                    placeholder="Select technique"
                    enumObject={ArtworkTechnique}
                    labels={ArtworkTechniqueLabels}
                  />

                  <EnumSelectField<CreateArtworkDTO, ArtworkStyle>
                    control={control}
                    name="style"
                    label="Style"
                    placeholder="Select style"
                    enumObject={ArtworkStyle}
                    labels={ArtworkStyleLabels}
                  />

                  <EnumSelectField<CreateArtworkDTO, ArtworkMotive>
                    control={control}
                    name="motive"
                    label="Motive"
                    placeholder="Select motive"
                    enumObject={ArtworkMotive}
                    labels={ArtworkMotiveLabels}
                  />

                  <EnumSelectField<CreateArtworkDTO, ArtworkOrientation>
                    control={control}
                    name="orientation"
                    label="Orientation"
                    placeholder="Select orientation"
                    enumObject={ArtworkOrientation}
                    labels={ArtworkOrientationLabels}
                  />

                  <EnumSelectField<CreateArtworkDTO, ArtworkStandardSize>
                    control={control}
                    name="size"
                    label="Size"
                    placeholder="Select size"
                    enumObject={ArtworkStandardSize}
                    labels={ArtworkStandardSizeLabels}
                  />

                  <BooleanRadioField<CreateArtworkDTO>
                    control={control}
                    name="framed"
                    label="Framed"
                    trueLabel="Yes"
                    falseLabel="No"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="space-y-4">
                <ImageUploadField<CreateArtworkDTO>
                  control={control}
                  setValue={setValue}
                  imgUrl="imageUrl"
                  imgPublicId="imagePublicId"
                  label="Artwork image"
                  buttonLabel="Upload image"
                />

                <TextareaField
                  label="Description"
                  placeholder="Type description"
                  rows={4}
                  error={errors.description?.message}
                  {...register("description")}
                />
              </div>

              <YearSelector<CreateArtworkDTO>
                control={control}
                name="year"
                label="Year"
                placeholder="Select year"
              />
            </div>
          </div>

          {apiError && (
            <p className="text-xs text-red-500">
              {apiError || "Failed to save artwork."}
            </p>
          )}

          <div className="pt-2">
            <Button type="submit" disabled={isBusy}>
              {isBusy && <Spinner size="sm" className="mr-2" />}
              {submitLabel}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
