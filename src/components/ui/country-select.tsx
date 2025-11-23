"use client";

import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { useCountries } from "@/hooks/useCountries";
import { cn } from "@/lib/utils";

type CountrySelectProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
};

export function CountrySelect({
  value,
  onChange,
  placeholder = "Select country",
  error,
}: CountrySelectProps) {
  const countries = useCountries();

  return (
    <div className="space-y-1">
      <Select.Root value={value ?? ""} onValueChange={onChange}>
        <Select.Trigger
          className={cn(
            "inline-flex w-full items-center justify-between rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm",
            "text-left shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
            "dark:border-zinc-700 dark:bg-zinc-950",
            error && "border-red-500 dark:border-red-500"
          )}
          aria-label="Country"
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="z-50 overflow-hidden rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <Select.ScrollUpButton className="flex items-center justify-center py-1 text-xs text-zinc-500">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="max-h-64 w-full p-1 text-sm">
              {countries.map((country) => (
                <Select.Item
                  key={country}
                  value={country}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900",
                    "dark:data-highlighted:bg-zinc-800 dark:data-highlighted:text-zinc-50"
                  )}
                >
                  <Select.ItemText>{country}</Select.ItemText>
                  <Select.ItemIndicator className="absolute right-2 flex items-center">
                    <CheckIcon className="h-4 w-4" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center py-1 text-xs text-zinc-500">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
