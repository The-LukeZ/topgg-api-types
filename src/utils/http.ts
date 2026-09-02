/**
 * Error thrown when a Top.gg API request returns a non-2xx response.
 */
export class TopGGAPIError extends Error {
  /**
   * The HTTP status code of the response.
   */
  status: number;
  /**
   * The `type` field from the error response, if present (v1 `application/problem+json` responses).
   */
  type?: string | undefined;
  /**
   * The `title` field from the error response, if present.
   */
  title?: string | undefined;
  /**
   * The `detail` field from the error response, if present. Falls back to the raw response body if it wasn't valid JSON.
   */
  detail?: string | undefined;
  /**
   * The value of the `Retry-After` response header, in seconds, if present (typically sent on 429 responses).
   */
  retryAfter?: number | undefined;

  constructor(
    message: string,
    init: {
      status: number;
      type?: string | undefined;
      title?: string | undefined;
      detail?: string | undefined;
      retryAfter?: number | undefined;
    }
  ) {
    super(message);
    this.name = "TopGGAPIError";
    this.status = init.status;
    this.type = init.type;
    this.title = init.title;
    this.detail = init.detail;
    this.retryAfter = init.retryAfter;
  }
}

/**
 * Builds a `?a=1&b=2` query string, skipping undefined values. Returns an empty string if no values are present.
 */
export function buildQueryString(query?: Record<string, string | number | undefined>): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value));
  }
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

async function parseErrorBody(
  res: Response
): Promise<{ type?: string | undefined; title?: string | undefined; detail?: string | undefined }> {
  try {
    const data = await res.json();
    if (data && typeof data === "object") {
      const { type, title, detail } = data as Record<string, unknown>;
      return {
        type: typeof type === "string" ? type : undefined,
        title: typeof title === "string" ? title : undefined,
        detail: typeof detail === "string" ? detail : JSON.stringify(data),
      };
    }
    return { detail: JSON.stringify(data) };
  } catch {
    try {
      return { detail: await res.text() };
    } catch {
      return {};
    }
  }
}

export interface PerformRequestOptions {
  baseUrl: string;
  path: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
  /**
   * How to encode `body`.
   *
   * @default "json"
   */
  bodyType?: "json" | "form";
  fetchImpl: typeof fetch;
}

function encodeFormBody(body: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(body)) {
    if (value !== undefined) params.set(key, String(value));
  }
  return params.toString();
}

/**
 * Performs an HTTP request against a Top.gg API, throwing {@link TopGGAPIError} on non-2xx responses.
 * Returns `undefined` for `204 No Content` responses, or any other response with an empty body.
 */
export async function performRequest<T>(opts: PerformRequestOptions): Promise<T | undefined> {
  const bodyType = opts.bodyType ?? "json";
  const encodedBody =
    opts.body !== undefined
      ? bodyType === "form"
        ? encodeFormBody(opts.body as Record<string, unknown>)
        : JSON.stringify(opts.body)
      : undefined;

  const res = await opts.fetchImpl(`${opts.baseUrl}${opts.path}`, {
    method: opts.method,
    headers: {
      ...(encodedBody !== undefined
        ? {
            "Content-Type":
              bodyType === "form" ? "application/x-www-form-urlencoded" : "application/json",
          }
        : {}),
      ...opts.headers,
    },
    ...(encodedBody !== undefined ? { body: encodedBody } : {}),
  });

  if (!res.ok) {
    const errBody = await parseErrorBody(res);
    const retryAfterHeader = res.headers.get("Retry-After");
    throw new TopGGAPIError(
      errBody.title ?? errBody.detail ?? `Request failed with status ${res.status}`,
      {
        status: res.status,
        type: errBody.type,
        title: errBody.title,
        detail: errBody.detail,
        retryAfter: retryAfterHeader ? Number(retryAfterHeader) : undefined,
      }
    );
  }

  if (res.status === 204) return undefined;
  const text = await res.text();
  if (!text) return undefined;
  return JSON.parse(text) as T;
}
