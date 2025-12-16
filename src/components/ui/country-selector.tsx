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

type CountryOption = { value: string; label: string };

type CountrySelectorProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: CountryOption[];
  requiredMessage?: string;
};

export function CountrySelector<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Country",
  placeholder = "Select country",
  options,
  requiredMessage,
}: CountrySelectorProps<TFieldValues>) {
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
              value={field.value ?? ""}
              onValueChange={(value) =>
                field.onChange(value === "" ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent>
                {options.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
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
