import { countries } from "countries-list";

export function useCountries() {
  return Object.values(countries)
    .map((c) => c.name)
    .sort((a, b) => a.localeCompare(b));
}
