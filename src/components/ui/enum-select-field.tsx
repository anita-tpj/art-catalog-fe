"use client";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

type EnumSelectFieldProps<
  TFieldValues extends FieldValues,
  TEnumValue extends string,
> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  /** TS enum object, exp. ArtworkTechnique */
  enumObject: Record<string, TEnumValue>;
  /** Labels map: value → label za UI, exp. Record<ArtworkTechnique, string> */
  labels: Record<TEnumValue, string>;
  requiredMessage?: string;
  sortOptions?: boolean;
};

export function EnumSelectField<
  TFieldValues extends FieldValues,
  TEnumValue extends string,
>({
  control,
  name,
  label,
  placeholder = "Select option",
  enumObject,
  labels,
  requiredMessage,
  sortOptions = false,
}: EnumSelectFieldProps<TFieldValues, TEnumValue>) {
  const { t } = useTranslation();

  const values = Object.values(enumObject) as TEnumValue[];

  const sortedValues = sortOptions
    ? [...values].sort((a, b) => {
        if (a === "OTHER") return 1;
        if (b === "OTHER") return -1;

        return t(labels[a]).localeCompare(t(labels[b]), undefined, {
          sensitivity: "base",
        });
      })
    : values;

  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <Controller
        name={name}
        control={control}
        rules={requiredMessage ? { required: requiredMessage } : undefined}
        render={({ field, fieldState }) => (
          <div className="space-y-1">
            <Select
              key={field.value ?? "empty"}
              value={field.value ?? ""}
              onValueChange={(value) => field.onChange(value as TEnumValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent>
                {sortedValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {t(labels[value])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldState.error?.message && (
              <p className="text-xs text-red-500">
                {t(fieldState.error.message)}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
