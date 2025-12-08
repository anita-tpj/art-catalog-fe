"use client";

import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";

type BooleanRadioFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  trueLabel?: string;
  falseLabel?: string;
  helperText?: string;
};

export function BooleanRadioField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  trueLabel = "Yes",
  falseLabel = "No",
  helperText,
}: BooleanRadioFieldProps<TFieldValues>) {
  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="space-y-1">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                />
                <span>{trueLabel}</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                />
                <span>{falseLabel}</span>
              </label>
            </div>

            {helperText && (
              <p className="text-xs text-zinc-500">{helperText}</p>
            )}
          </div>
        )}
      />
    </div>
  );
}
