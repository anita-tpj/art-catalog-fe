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

export function formatCompactTime(dt: string | null) {
  if (!dt) return "—";
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt;
  }
}

export function formatRelativeTime(dt: string | null) {
  if (!dt) return "—";
  const ms = Date.now() - new Date(dt).getTime();
  if (Number.isNaN(ms)) return "—";

  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
