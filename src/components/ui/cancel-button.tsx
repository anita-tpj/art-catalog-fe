"use client";

import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

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
  children,
}: CancelButtonProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const label = children ?? t("Cancel");

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
      {label}
    </Button>
  );
}
