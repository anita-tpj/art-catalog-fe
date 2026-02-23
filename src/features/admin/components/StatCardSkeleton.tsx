export const StatCardSkeleton = () => {
  return (
    <div className="rounded-2xl border p-5">
      <div className="flex items-start justify-between">
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="h-5 w-5 rounded bg-muted" />
      </div>
      <div className="mt-3 h-9 w-20 rounded bg-muted" />
      <div className="mt-3 h-3 w-40 rounded bg-muted" />
      <div className="mt-4 h-20 rounded bg-muted" />
    </div>
  );
};
