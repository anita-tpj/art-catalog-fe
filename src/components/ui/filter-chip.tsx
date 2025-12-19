"use client";

type Props = {
  label: string;
  onRemove?: () => void;
};

export function FilterChip({ label, onRemove }: Props) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
      <span className="truncate">{label}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full px-1 text-muted-foreground hover:text-foreground"
          aria-label={`Remove ${label}`}
          title="Remove"
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
