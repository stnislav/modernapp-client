const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || "";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function httpRequest<TResponse>(
  path: string,
  options?: {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
    signal?: AbortSignal;
  }
): Promise<TResponse> {
  const method = options?.method ?? "GET";
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const headers: Record<string, string> = {
    Accept: "application/json, text/plain, */*",
    ...(options?.headers ?? {}),
  };

  let body: BodyInit | undefined = undefined;

  if (options?.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
    signal: options?.signal,
  });

  if (!res.ok) {
    const text = await safeReadText(res);


    if (res.status === 401) {

      throw new HttpError(res.status, res.statusText, text, "UNAUTHORIZED");
    }

    throw new HttpError(res.status, res.statusText, text);
  }

  // 204 No Content 
  if (res.status === 204) {
    return undefined as TResponse;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as TResponse;
  }

  return (await res.text()) as unknown as TResponse;
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

export class HttpError extends Error {
  public status: number;
  public statusText: string;
  public body: string;
  public code?: string;

  constructor(status: number, statusText: string, body: string, code?: string) {
    super(`HTTP ${status} ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.body = body;
    this.code = code;
  }
}

export function httpGet<T>(path: string, signal?: AbortSignal) {
  return httpRequest<T>(path, { method: "GET", signal });
}

export function httpPost<T>(path: string, body: unknown, signal?: AbortSignal) {
  return httpRequest<T>(path, { method: "POST", body, signal });
}

export function httpPut<T>(path: string, body: unknown, signal?: AbortSignal) {
  return httpRequest<T>(path, { method: "PUT", body, signal });
}

export function httpDelete<T>(path: string, signal?: AbortSignal) {
  return httpRequest<T>(path, { method: "DELETE", signal });
}
