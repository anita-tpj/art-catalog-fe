"use client";

import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) {
  const hasValue = value.trim().length > 0;

  return (
    <div className="relative w-full md:max-w-sm">
      {/* left icon */}
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
        <MagnifyingGlassIcon className="h-4 w-4 text-zinc-400" />
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full rounded-md border border-zinc-200 bg-white py-1.5
          pl-7 pr-8 text-sm text-zinc-900 shadow-sm outline-none ring-0
          placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400
          dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500
          dark:focus:border-zinc-500 dark:focus:ring-zinc-500
        "
        placeholder={placeholder}
      />

      {/* clear button */}
      {hasValue ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            inline-flex h-6 w-6 items-center justify-center rounded
            text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700
            focus:outline-none focus:ring-2 focus:ring-zinc-400
            dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus:ring-zinc-500
          "
          aria-label="Clear search"
        >
          <Cross2Icon className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
