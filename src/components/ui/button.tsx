import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
}

export function Button({
  asChild,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:ring-zinc-900 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-zinc-50 dark:focus-visible:ring-offset-zinc-950",
        variant === "primary" &&
          "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200",
        variant === "outline" &&
          "border border-zinc-300 bg-transparent hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800",
        variant === "ghost" &&
          "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800",
        size === "sm" && "h-8 px-3",
        size === "md" && "h-9 px-4",
        className
      )}
      {...props}
    />
  );
}
