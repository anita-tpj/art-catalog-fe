"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <h2 className="text-lg font-semibold">Something went wrong</h2>

      <p className="text-sm text-zinc-500">{error.message}</p>

      <Button variant="outline" onClick={() => location.reload()}>
        Reload page
      </Button>
    </div>
  );
}
