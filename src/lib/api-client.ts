// lib/api-client.ts

import { isPublicAdminRoute } from "@/features/admin/config/adminRoutes";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "./config";

type FetchOpts = {
  // Next.js fetch options
  revalidate?: number;
  // If you want tags later:
  tags?: string[];
  // Normal fetch init extras
  headers?: Record<string, string>;
};

/**
 * Error type carrying HTTP status.
 * Enables global auth handling (401 redirect).
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Best-effort logout to clear server session & cookie.
 * We do not block redirect if this fails.
 */
async function bestEffortLogout() {
  if (typeof window === "undefined") return;

  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: { accept: "application/json" },
    });
  } catch {
    // ignore network errors
  }
}

let isRedirectingForAuth = false;

/**
 * Handle expired/invalid session globally.
 * Shows toast, logs out, and redirects to login.
 */
async function maybeRedirectOn401(error: unknown) {
  if (typeof window === "undefined") return;

  const status =
    error instanceof ApiError
      ? error.status
      : typeof (error as { status?: unknown })?.status === "number"
        ? (error as { status: number }).status
        : undefined;

  if (status !== 401) return;

  // Public admin routes do not require an authenticated session.
  if (isPublicAdminRoute(window.location.pathname)) return;

  // Prevent multiple redirects & duplicate toasts.
  if (isRedirectingForAuth) return;
  isRedirectingForAuth = true;

  // Load translations only in the browser.
  let message = "Session expired. Please sign in again.";

  try {
    const { default: i18n } = await import("@/i18n");
    message = i18n.t("Session expired. Please sign in again.");
  } catch {
    // Use English fallback if translations cannot be loaded.
  }

  toast.error(message);

  // Attempt backend logout (non-blocking).
  void bestEffortLogout();

  const next = encodeURIComponent(
    window.location.pathname + window.location.search,
  );

  window.location.href = `/admin/login?next=${next}`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    let code: string | undefined;

    try {
      const errorData: unknown = await res.json();

      if (errorData && typeof errorData === "object") {
        if ("message" in errorData && typeof errorData.message === "string") {
          message = errorData.message;
        }

        if ("code" in errorData && typeof errorData.code === "string") {
          code = errorData.code;
        }
      }
    } catch {
      // Response may not contain valid JSON.
    }

    throw new ApiError(message, res.status, code);
  }

  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}

function buildInit(
  method?: string,
  opts?: FetchOpts,
  body?: unknown,
): RequestInit {
  const headers: Record<string, string> = {
    accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(opts?.headers ?? {}),
  };

  const init: RequestInit = {
    method,
    headers,
    credentials: "include", // cookie session auth
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  // Next.js server fetch options (harmless on client)
  if (opts?.revalidate !== undefined || opts?.tags) {
    (init as any).next = {
      ...(opts?.revalidate !== undefined
        ? { revalidate: opts.revalidate }
        : {}),
      ...(opts?.tags ? { tags: opts.tags } : {}),
    };
  }

  return init;
}

export async function get<T>(path: string, opts?: FetchOpts): Promise<T> {
  try {
    const res = await fetch(
      `${API_BASE_URL}${path}`,
      buildInit(undefined, opts),
    );
    return await handleResponse<T>(res);
  } catch (error) {
    void maybeRedirectOn401(error);
    throw error;
  }
}

export async function getById<T>(
  path: string,
  id: number,
  opts?: FetchOpts,
): Promise<T> {
  try {
    const res = await fetch(
      `${API_BASE_URL}${path}/${id}`,
      buildInit(undefined, opts),
    );
    return await handleResponse<T>(res);
  } catch (error) {
    void maybeRedirectOn401(error);
    throw error;
  }
}

export async function post<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  opts?: FetchOpts,
): Promise<TResponse> {
  try {
    const res = await fetch(
      `${API_BASE_URL}${path}`,
      buildInit("POST", opts, body),
    );
    return await handleResponse<TResponse>(res);
  } catch (error) {
    void maybeRedirectOn401(error);
    throw error;
  }
}

export async function put<TResponse, TBody = unknown>(
  path: string,
  id: number,
  body: TBody,
  opts?: FetchOpts,
): Promise<TResponse> {
  try {
    const res = await fetch(
      `${API_BASE_URL}${path}/${id}`,
      buildInit("PUT", opts, body),
    );
    return await handleResponse<TResponse>(res);
  } catch (error) {
    void maybeRedirectOn401(error);
    throw error;
  }
}

export async function patch<TResponse>(
  path: string,
  opts?: FetchOpts,
): Promise<TResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, buildInit("PATCH", opts));

    return await handleResponse<TResponse>(res);
  } catch (error) {
    void maybeRedirectOn401(error);
    throw error;
  }
}

export async function del<T>(
  path: string,
  id?: number | string,
  opts?: FetchOpts,
): Promise<T> {
  try {
    const url = id !== undefined ? `${path}/${id}` : path;

    const res = await fetch(`${API_BASE_URL}${url}`, buildInit("DELETE", opts));

    return await handleResponse<T>(res);
  } catch (error) {
    void maybeRedirectOn401(error);
    throw error;
  }
}
