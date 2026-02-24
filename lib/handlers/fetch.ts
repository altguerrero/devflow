import { normalizeError } from "@/lib/handlers/error-core";
import type { ActionResponse } from "@/types/global";

export interface FetchLoggerLike {
  warn: (obj: unknown, msg?: string) => void;
  error: (obj: unknown, msg?: string) => void;
}

type FetchHandlerOptions = Omit<RequestInit, "body"> & {
  url: string;
  body?: BodyInit | Record<string, unknown> | unknown[] | null;
  timeout?: number;
  logger?: FetchLoggerLike;
};

type APIActionSuccess<T> = {
  success: true;
  data?: T;
  status?: number;
};

type APIActionError = {
  success: false;
  error: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

const DEFAULT_FETCH_TIMEOUT_MS = 5000;

const isActionResponse = <T>(value: unknown): value is ActionResponse<T> => {
  if (!value || typeof value !== "object") return false;
  if (!("success" in value)) return false;

  return typeof (value as { success?: unknown }).success === "boolean";
};

const isJsonBody = (body: FetchHandlerOptions["body"]) => {
  if (body == null) return false;

  if (typeof body === "string") return false;

  if (typeof FormData !== "undefined" && body instanceof FormData) return false;
  if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) return false;
  if (typeof Blob !== "undefined" && body instanceof Blob) return false;
  if (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer) return false;

  return true;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    const text = await response.text();
    return text || null;
  } catch {
    return null;
  }
};

const createRequestSignal = (
  signal: AbortSignal | null | undefined,
  timeout: number
): {
  signal: AbortSignal;
  clear: () => void;
  didTimeout: () => boolean;
} => {
  const controller = new AbortController();
  let timedOut = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let abortListenerCleanup = () => {};

  if (signal) {
    if (signal.aborted) {
      controller.abort(signal.reason);
    } else {
      const onAbort = () => controller.abort(signal.reason);
      signal.addEventListener("abort", onAbort, { once: true });
      abortListenerCleanup = () => signal.removeEventListener("abort", onAbort);
    }
  }

  if (timeout > 0) {
    timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort(new DOMException(`Request timed out after ${timeout}ms`, "AbortError"));
    }, timeout);
  }

  return {
    signal: controller.signal,
    clear: () => {
      if (timeoutId) clearTimeout(timeoutId);
      abortListenerCleanup();
    },
    didTimeout: () => timedOut,
  };
};

export const handleFetch = async <TData = null>({
  url,
  headers,
  body,
  timeout = DEFAULT_FETCH_TIMEOUT_MS,
  logger,
  ...init
}: FetchHandlerOptions): Promise<ActionResponse<TData>> => {
  const requestSignal = createRequestSignal(init.signal, timeout);

  try {
    const requestHeaders = new Headers(headers);
    const requestBody = isJsonBody(body)
      ? JSON.stringify(body)
      : (body as BodyInit | null | undefined);

    if (!requestHeaders.has("Accept")) {
      requestHeaders.set("Accept", "application/json");
    }

    if (isJsonBody(body) && !requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
      ...init,
      headers: requestHeaders,
      signal: requestSignal.signal,
      ...(body !== undefined ? { body: requestBody } : {}),
    });

    const payload = await parseResponseBody(response);

    if (!response.ok) {
      logger?.warn?.(
        {
          url,
          status: response.status,
          method: init.method ?? "GET",
        },
        "HTTP request failed"
      );

      if (isActionResponse<TData>(payload) && payload.success === false) {
        return { ...payload, status: payload.status ?? response.status };
      }

      const fallbackMessage =
        typeof payload === "string" ? payload : response.statusText || "Request failed";

      const errorResponse: APIActionError = {
        success: false,
        error: { message: fallbackMessage },
        status: response.status,
      };

      return errorResponse;
    }

    if (isActionResponse<TData>(payload) && payload.success === true) {
      return { ...payload, status: payload.status ?? response.status };
    }

    const successResponse: APIActionSuccess<TData> = {
      success: true,
      ...(payload !== null ? { data: payload as TData } : {}),
      status: response.status,
    };

    return successResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      if (requestSignal.didTimeout()) {
        logger?.warn?.(
          {
            url,
            timeout,
            method: init.method ?? "GET",
          },
          "HTTP request timed out"
        );

        return {
          success: false,
          error: {
            message: `Request timed out after ${timeout}ms`,
          },
        };
      }

      logger?.warn?.({ url, method: init.method ?? "GET" }, "HTTP request aborted");
    } else {
      logger?.error?.(
        {
          url,
          method: init.method ?? "GET",
          err: error instanceof Error ? error : undefined,
        },
        "HTTP request error"
      );
    }

    const normalizedError = normalizeError(error, "Network request failed");

    return {
      success: false,
      error: normalizedError.body.error,
      status: normalizedError.status,
    };
  } finally {
    requestSignal.clear();
  }
};

export default handleFetch;
