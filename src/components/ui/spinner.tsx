"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md";
  className?: string;
}

export function Spinner({ size = "sm", className }: SpinnerProps) {
  const sizeClasses = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-zinc-400 border-t-transparent",
        sizeClasses,
        className
      )}
      aria-hidden="true"
    />
  );
}
