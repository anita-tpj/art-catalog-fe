"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CancelButtonProps {
  to?: string;
  back?: true;
  disabled?: boolean;
  children?: string;
}

export function CancelButton({
  to,
  back,
  disabled = false,
  children = "Cancel",
}: CancelButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (back) {
      router.back();
      return;
    }
    if (!to) {
      throw new Error("CancelButton requires either `to` or `back`");
    }
    router.push(to);
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}

