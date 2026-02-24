import { ZodError, flattenError } from "zod";

import { toErrorResponse, validationError } from "@/lib/http-errors";

export type ErrorResponseBody = {
  success: false;
  error: {
    message: string;
    details?: Record<string, string[]>;
  };
};

export interface NormalizedErrorResult {
  status: number;
  body: ErrorResponseBody;
}

export const normalizeError = (
  error: unknown,
  fallbackMessage = "Internal Server Error"
): NormalizedErrorResult => {
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
