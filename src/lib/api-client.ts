const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

// Jedno mesto za error handling
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

    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  return handleResponse<T>(res);
}

export async function getById<T>(path: string, id: number): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}/${id}`);

  return handleResponse<T>(res);
}

export async function post<TResponse, TBody = unknown>(
  path: string,
  body: TBody
): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return handleResponse<TResponse>(res);
}

export async function put<TResponse, TBody = unknown>(
  path: string,
  id: number,
  body: TBody
): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return handleResponse<TResponse>(res);
}

export async function del<T>(path: string, id: number): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse<T>(res);
}
