import { ReactNode } from "react";

type ResponsiveListProps<T> = {
  items: T[];
  isLoading?: boolean;
  loadingContent?: ReactNode;
  renderTable: (items: T[]) => ReactNode;
  renderCards: (items: T[]) => ReactNode;
};

export function ResponsiveList<T>({
  items,
  isLoading,
  loadingContent,
  renderTable,
  renderCards,
}: ResponsiveListProps<T>) {
  if (isLoading) {
    return (
      <>
        {loadingContent ?? (
          <div className="text-sm text-zinc-500">Loading...</div>
        )}
      </>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">{renderTable(items)}</div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">{renderCards(items)}</div>
    </>
  );
}
