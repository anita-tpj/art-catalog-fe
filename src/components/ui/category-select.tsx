"use client";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label?: string;
  placeholder?: string;
};

export function CategorySelect({
  value,
  onChange,
  options,
  label,
  placeholder = "Select category",
}: Props) {
  return (
    <div className="space-y-1">
      {label ? <Label>{label}</Label> : null}

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="
            w-full rounded-md border border-zinc-200 bg-white
            px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0
            focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400
            dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
            dark:focus:border-zinc-500 dark:focus:ring-zinc-500
          "
        >
          <SelectValue
            placeholder={placeholder}
            className="text-zinc-400 dark:text-zinc-500"
          />
        </SelectTrigger>

        <SelectContent
          className="
            border border-zinc-200 bg-white text-zinc-900 shadow-md
            dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
          "
        >
          {options.map((o) => (
            <SelectItem
              key={o.value || "all"}
              value={o.value}
              className="
                focus:bg-zinc-100 focus:text-zinc-900
                dark:focus:bg-zinc-800 dark:focus:text-zinc-100
              "
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
