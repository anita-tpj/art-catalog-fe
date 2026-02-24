import { Button } from "@/components/ui";
import Link from "next/link";

interface EmptyStateProps {
  message: string;
  actionHref: string;
  actionLabel: string;
}

export function EmptyState({
  message,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-sm text-zinc-500">{message}</p>

      <Link href={actionHref}>
        <Button>{actionLabel}</Button>
      </Link>
    </div>
  );
}
