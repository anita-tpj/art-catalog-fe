import { countries } from "countries-list";

export type CountryOption = {
  value: string;
  label: string;
};

export function useCountryOptions(): CountryOption[] {
  return Object.values(countries)
    .map((c) => ({
      value: c.name,
      label: c.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
