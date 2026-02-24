import { cn } from "@/lib/utils";
import * as RadixLabel from "@radix-ui/react-label";
import * as React from "react";

export const Label = React.forwardRef<
  React.ElementRef<typeof RadixLabel.Root>,
  React.ComponentPropsWithoutRef<typeof RadixLabel.Root>
>(({ className, ...props }, ref) => (
  <RadixLabel.Root
    ref={ref}
    className={cn(
      "text-sm font-medium text-zinc-700 dark:text-zinc-300",
      className,
    )}
    {...props}
  />
));

Label.displayName = "Label";
