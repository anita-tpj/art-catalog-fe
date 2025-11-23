"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  children: ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  children,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  isDestructive = true,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-40 bg-black/40" />

        <AlertDialog.Content
          className="
            fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2
            rounded-lg border border-zinc-200 bg-white p-4 shadow-lg
            dark:border-zinc-700 dark:bg-zinc-900
          "
        >
          <AlertDialog.Title className="text-sm font-semibold">
            {title}
          </AlertDialog.Title>

          {description && (
            <AlertDialog.Description className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
              {description}
            </AlertDialog.Description>
          )}

          <div className="mt-4 flex items-center justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" size="sm">
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <Button
                size="sm"
                variant={isDestructive ? "destructive" : "primary"}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
