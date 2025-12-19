"use client";

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mt-6 rounded-lg border p-6">
      <div className="text-base font-semibold">{title}</div>
      {message ? (
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      ) : null}

      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-4 h-9 rounded-md border px-3 text-sm font-medium"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
