"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type TextInputFieldProps = {
  label: string;
  error?: string;
  containerClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextInputField = React.forwardRef<
  HTMLInputElement,
  TextInputFieldProps
>(function TextInputField(
  { label, error, containerClassName, id, ...inputProps },
  ref
) {
  const inputId = id ?? inputProps.name;

  return (
    <div className={containerClassName ?? "space-y-1"}>
      <Label htmlFor={inputId}>{label}</Label>
      <Input className="h-10" id={inputId} ref={ref} {...inputProps} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});
