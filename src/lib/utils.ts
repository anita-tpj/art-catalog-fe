import { type ClassValue, clsx } from "clsx";
import { notFound } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPositiveInt(v: string | undefined, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function humanizeEnum(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/(^\w)|(\s\w)/g, (m) => m.toUpperCase());
}

export function parseIdOrNotFound(idParam: string) {
  const id = Number(idParam);
  if (!Number.isFinite(id)) notFound();
  return id;
}
