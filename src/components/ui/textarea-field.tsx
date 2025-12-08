"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";

type TextareaFieldProps = {
  label: string;
  error?: string;
  containerClassName?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(function TextareaField(
  { label, error, containerClassName, id, className, ...textareaProps },
  ref
) {
  const textareaId = id ?? textareaProps.name;

  return (
    <div className={containerClassName ?? "space-y-1"}>
      <Label htmlFor={textareaId}>{label}</Label>
      <textarea
        id={textareaId}
        ref={ref}
        className={
          className ??
          "w-full rounded-md border border-zinc-300 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        }
        {...textareaProps}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});
