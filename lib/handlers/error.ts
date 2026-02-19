import { NextResponse } from "next/server";
import { ZodError, flattenError } from "zod";

import { toErrorResponse, validationError } from "@/lib/http-errors";
import logger from "@/lib/logger";

export type ErrorResponseBody = {
  success: false;
  error: {
    message: string;
    details?: Record<string, string[]>;
  };
};

export type ResponseType = "api" | "server";

export const normalizeError = (
  error: unknown,
  fallbackMessage = "Internal Server Error"
): { status: number; body: ErrorResponseBody } => {
  if (error instanceof ZodError) {
    const fieldErrors = flattenError(error).fieldErrors as Record<string, string[]>;
    const zodAsValidationError = validationError(fieldErrors);
    return normalizeError(zodAsValidationError, fallbackMessage);
  }

  const { status, message, errors } = toErrorResponse(error, fallbackMessage);

  return {
    status,
    body: {
      success: false,
      error: {
        message,
        ...(errors ? { details: errors } : {}),
      },
    },
  };
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

  if (status >= 500) {
    logger.error(logContext, "Unhandled server error");
  } else {
    logger.warn(logContext, "Handled request error");
  }

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
