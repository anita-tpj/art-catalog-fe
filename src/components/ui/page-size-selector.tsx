"use client";

import * as Select from "@radix-ui/react-select";
import { FiChevronDown } from "react-icons/fi";

interface PageSizeSelectorProps {
  value: number;
  onChange: (val: number) => void;
  options?: number[];
}

export function PageSizeSelector({
  value,
  onChange,
  options = [1, 2, 5],
}: PageSizeSelectorProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
      {/* Show label only on md+ */}
      <span className="hidden md:inline-block text-xs">Per page</span>

      <Select.Root
        value={String(value)}
        onValueChange={(val) => onChange(Number(val))}
      >
        <Select.Trigger
          className="
            inline-flex h-8 min-w-12 items-center justify-between gap-1
            rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs
            shadow-sm transition-colors
            hover:bg-zinc-100
            dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800
          "
          aria-label="Rows per page"
        >
          <Select.Value />
          <FiChevronDown size={12} className="opacity-70" />
        </Select.Trigger>

        <Select.Content
          className="
            z-50 rounded-md border border-zinc-200 bg-white text-xs shadow-lg
            dark:border-zinc-700 dark:bg-zinc-900
          "
          sideOffset={4}
        >
          <Select.Viewport className="p-1">
            {options.map((size) => (
              <Select.Item
                key={size}
                value={String(size)}
                className="
                  cursor-pointer select-none rounded px-2 py-1
                  text-zinc-700 outline-none hover:bg-zinc-100
                  dark:text-zinc-100 dark:hover:bg-zinc-800
                "
              >
                <Select.ItemText>{size}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
