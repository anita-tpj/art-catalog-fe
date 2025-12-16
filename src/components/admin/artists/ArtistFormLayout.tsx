"use client";

import { AvatarUploadField } from "@/components/ui/avatar-upload-field";
import { Button } from "@/components/ui/button";
import { CancelButton } from "@/components/ui/cancel-button";
import { Card } from "@/components/ui/card";
import { CountrySelect } from "@/components/ui/country-select";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { TextInputField } from "@/components/ui/text-input-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { YearSelector } from "@/components/ui/year-selector";

import { CreateArtistDTO } from "@/services/artists";

import { Controller, UseFormReturn } from "react-hook-form";

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
              <AvatarUploadField<CreateArtistDTO>
                control={control}
                setValue={setValue}
                imgUrl="avatarUrl"
                imgPublicId="avatarPublicId"
                label="Artist avatar"
                buttonLabel="Upload image"
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
                  <Label htmlFor="country">Country</Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <CountrySelect
                        key={field.value ?? "empty"}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        error={errors.country?.message}
                      />
                    )}
                  />
                </div>
                {/* Artist ptimary category */}
                <div className="space-y-1 w-1/2">
                  {/* <Label htmlFor="country">Artist category</Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <CountrySelect
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        error={errors.country?.message}
                      />
                    )}
                  /> */}
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
