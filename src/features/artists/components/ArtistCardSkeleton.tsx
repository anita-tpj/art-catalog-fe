export const ArtistCardSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border bg-background">
      <div className="aspect-4/3 bg-muted" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
};
