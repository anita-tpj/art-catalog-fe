export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white/60 py-4 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <span>© {new Date().getFullYear()} ArtCatalog</span>
        <span className="hidden sm:inline">
          Admin panel & public gallery (WIP)
        </span>
      </div>
    </footer>
  );
}
