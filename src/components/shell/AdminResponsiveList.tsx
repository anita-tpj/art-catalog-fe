import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

type ResponsiveListProps<T> = {
  items: T[];
  isLoading?: boolean;
  loadingContent?: ReactNode;
  renderTable: (items: T[]) => ReactNode;
  renderCards: (items: T[]) => ReactNode;
};

export function AdminResponsiveList<T>({
  items,
  isLoading,
  loadingContent,
  renderTable,
  renderCards,
}: ResponsiveListProps<T>) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <>
        {loadingContent ?? (
          <div className="text-sm text-zinc-500">{t("Loading...")}</div>
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
