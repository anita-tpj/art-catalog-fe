// lib/api-client.ts

import { toast } from "react-hot-toast";

type FetchOpts = {
  // Next.js fetch options
  revalidate?: number;
  // If you want tags later:
  tags?: string[];
  // Normal fetch init extras
  headers?: Record<string, string>;
};

const API_BASE_URL =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5000";

/**
 * Error type carrying HTTP status.
 * Enables global auth handling (401 redirect).
 */
class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
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
function maybeRedirectOn401(error: unknown) {
  if (typeof window === "undefined") return;

  const status =
    error instanceof ApiError
      ? error.status
      : typeof (error as any)?.status === "number"
        ? (error as any).status
        : undefined;

  if (status !== 401) return;

  // Avoid redirect loop if already on login page
  if (window.location.pathname === "/admin/login") return;

  // Prevent multiple redirects & duplicate toasts
  if (isRedirectingForAuth) return;
  isRedirectingForAuth = true;

  // Notify user
  toast.error("Session expired. Please sign in again.");

  // Attempt backend logout (non-blocking)
  void bestEffortLogout();

  const next = encodeURIComponent(
    window.location.pathname + window.location.search,
  );

  window.location.href = `/admin/login?next=${next}`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;

    try {
      const errorData = await res.json();
      if (
        errorData &&
        typeof errorData === "object" &&
        "message" in errorData
      ) {
        message = String((errorData as any).message);
      }
    } catch {}

    throw new ApiError(message, res.status);
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
  if (opts?.revalidate || opts?.tags) {
    (init as any).next = {
      ...(opts?.revalidate ? { revalidate: opts.revalidate } : {}),
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
    maybeRedirectOn401(error);
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
    maybeRedirectOn401(error);
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
    maybeRedirectOn401(error);
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
    maybeRedirectOn401(error);
    throw error;
  }
}

export async function del<T>(
  path: string,
  id: number,
  opts?: FetchOpts,
): Promise<T> {
  try {
    const res = await fetch(
      `${API_BASE_URL}${path}/${id}`,
      buildInit("DELETE", opts),
    );
    return await handleResponse<T>(res);
  } catch (error) {
    maybeRedirectOn401(error);
    throw error;
  }
}
