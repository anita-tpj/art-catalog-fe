"use client";

import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getYearOptions,
  DEFAULT_MIN_YEAR,
  CURRENT_YEAR,
} from "@/lib/year-options";

type YearSelectorProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  requiredMessage?: string;
};

export function YearSelector<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Year",
  minYear = DEFAULT_MIN_YEAR,
  maxYear = CURRENT_YEAR,
  placeholder = "Select year",
  requiredMessage,
}: YearSelectorProps<TFieldValues>) {
  const years = getYearOptions(minYear, maxYear);

  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        rules={requiredMessage ? { required: requiredMessage } : undefined}
        render={({ field, fieldState }) => (
          <div className="space-y-1">
            <Select
              key={field.value ?? "empty"}
              value={field.value == null ? "" : String(field.value)}
              onValueChange={(value) =>
                field.onChange(value === "" ? undefined : Number(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldState.error && (
              <p className="text-xs text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
}
