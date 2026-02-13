export const ArtworkCardSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border bg-background">
      <div className="aspect-[4/3] bg-muted" />

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-10 rounded bg-muted" />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="h-5 w-20 rounded-full bg-muted" />
          <div className="h-5 w-24 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
};
