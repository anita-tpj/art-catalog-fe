import { type ClassValue, clsx } from "clsx";
import { notFound } from "next/navigation";
import { twMerge } from "tailwind-merge";

/** Tailwind class merge helper */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Ensures positive integer with fallback */
export function toPositiveInt(v: string | undefined, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Converts ENUM_VALUE to "Enum Value" */
export function humanizeEnum(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Parses numeric ID or throws 404 (server only) */
export function parseIdOrNotFound(idParam: string) {
  const id = Number(idParam);
  if (!Number.isFinite(id)) notFound();
  return id;
}

/** Formats date to local string */
export function formatCompactTime(dt: string | null) {
  if (!dt) return "—";
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt;
  }
}

/** Formats date to relative time (e.g. 5m ago) */
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

export function getSectionRoot(pathname: string) {
  return "/" + pathname.split("/").slice(1, 3).join("/");
}
