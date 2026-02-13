// lib/api-client.ts
type FetchOpts = {
  // Next.js fetch options
  revalidate?: number;
  // if you want tags later:
  tags?: string[];
  // normal fetch init extras
  headers?: Record<string, string>;
};

const API_BASE_URL =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;

    try {
      const errorData = await res.json();
      if (errorData && typeof errorData === "object" && "message" in errorData) {
        message = String((errorData as any).message);
      }
    } catch {}

    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function buildInit(method?: string, opts?: FetchOpts, body?: unknown): RequestInit {
  const headers: Record<string, string> = {
    accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(opts?.headers ?? {}),
  };

  const init: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  // Next.js: only meaningful in server fetch, harmless otherwise
  if (opts?.revalidate || opts?.tags) {
    (init as any).next = {
      ...(opts?.revalidate ? { revalidate: opts.revalidate } : {}),
      ...(opts?.tags ? { tags: opts.tags } : {}),
    };
  }

  return init;
}

export async function get<T>(path: string, opts?: FetchOpts): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, buildInit(undefined, opts));
  return handleResponse<T>(res);
}

export async function getById<T>(path: string, id: number, opts?: FetchOpts): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}/${id}`, buildInit(undefined, opts));
  return handleResponse<T>(res);
}

export async function post<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  opts?: FetchOpts,
): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, buildInit("POST", opts, body));
  return handleResponse<TResponse>(res);
}

export async function put<TResponse, TBody = unknown>(
  path: string,
  id: number,
  body: TBody,
  opts?: FetchOpts,
): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}/${id}`, buildInit("PUT", opts, body));
  return handleResponse<TResponse>(res);
}

export async function del<T>(path: string, id: number, opts?: FetchOpts): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}/${id}`, buildInit("DELETE", opts));
  return handleResponse<T>(res);
}
