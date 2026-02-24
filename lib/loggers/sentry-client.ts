"use client";

import * as Sentry from "@sentry/nextjs";

import type { FetchLoggerLike } from "@/lib/handlers/fetch";

const toRecord = (value: unknown): Record<string, unknown> => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }

  return { value };
};

const shouldReport = (context: Record<string, unknown>, message?: string) => {
  const status = typeof context.status === "number" ? context.status : null;

  if (status !== null) {
    return status >= 500;
  }

  if (message === "HTTP request aborted") {
    return false;
  }

  return true;
};

export const sentryClientFetchLogger: FetchLoggerLike = {
  warn(obj, msg) {
    const context = toRecord(obj);

    if (!shouldReport(context, msg)) return;

    Sentry.captureMessage(msg ?? "Fetch warning", {
      level: "warning",
      extra: context,
    });
  },
  error(obj, msg) {
    const context = toRecord(obj);

    if (!shouldReport(context, msg)) return;

    const err = context.err;

    if (err instanceof Error) {
      Sentry.captureException(err, {
        extra: context,
      });
      return;
    }

    Sentry.captureMessage(msg ?? "Fetch error", {
      level: "error",
      extra: context,
    });
  },
};

export default sentryClientFetchLogger;
