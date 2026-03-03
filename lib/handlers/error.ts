import HTTP_STATUS from "@/constants/http-status";
import { type ErrorResponseBody, normalizeError } from "@/lib/handlers/error-core";
import logger from "@/lib/logger";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export type ResponseType = "api" | "server";
export type { ErrorResponseBody } from "@/lib/handlers/error-core";
export { normalizeError } from "@/lib/handlers/error-core";

const shouldReportToSentry = (status: number) => status >= HTTP_STATUS.INTERNAL_SERVER_ERROR;

const reportErrorToSentry = (
  error: unknown,
  context: {
    status: number;
    responseType: ResponseType;
    message: string;
    details?: Record<string, string[]>;
  }
) => {
  if (!shouldReportToSentry(context.status)) return;

  Sentry.withScope((scope) => {
    scope.setTag("error_handler", "handleError");
    scope.setTag("response_type", context.responseType);
    scope.setTag("http_status", String(context.status));
    scope.setLevel("error");

    if (context.details) {
      scope.setContext("error_details", context.details);
    }

    if (error instanceof Error) {
      Sentry.captureException(error);
      return;
    }

    Sentry.captureMessage(context.message);
  });
};

export const handleError = (
  error: unknown,
  responseType: ResponseType = "server",
  fallbackMessage = "Internal Server Error"
): NextResponse<ErrorResponseBody> | ({ status: number } & ErrorResponseBody) => {
  const { status, body } = normalizeError(error, fallbackMessage);
  const logContext = {
    status,
    responseType,
    message: body.error.message,
    details: body.error.details,
    err: error instanceof Error ? error : undefined,
  };

  if (status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    logger.error(logContext, "Unhandled server error");
  } else {
    logger.warn(logContext, "Handled request error");
  }

  reportErrorToSentry(error, {
    status,
    responseType,
    message: body.error.message,
    details: body.error.details,
  });

  if (responseType === "api") {
    return NextResponse.json(body, { status });
  }

  return { status, ...body };
};

export const handleApiError = (
  error: unknown,
  fallbackMessage = "Internal Server Error"
): NextResponse<ErrorResponseBody> => {
  return handleError(error, "api", fallbackMessage) as NextResponse<ErrorResponseBody>;
};

export default handleError;
