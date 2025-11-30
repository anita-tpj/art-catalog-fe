"use client";

interface SearchEmptyStateProps {
  query: string;
  entityLabel?: string;
}

export function SearchEmptyState({
  query,
  entityLabel = "items",
}: SearchEmptyStateProps) {
  if (!query.trim()) return null;

  return (
    <div className="rounded-md border border-zinc-200 p-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
      No {entityLabel} match “{query}”.
    </div>
  );
}
