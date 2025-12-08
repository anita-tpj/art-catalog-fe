export const CURRENT_YEAR = new Date().getFullYear();

export const DEFAULT_MIN_YEAR = 1800;

export function getYearOptions(
  minYear: number = DEFAULT_MIN_YEAR,
  maxYear: number = CURRENT_YEAR
): number[] {
  if (maxYear < minYear) return [];

  return Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
}
