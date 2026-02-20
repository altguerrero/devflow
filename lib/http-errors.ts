export type HttpErrorOptions = {
  cause?: unknown;
  details?: unknown;
};

export type FieldErrors = Record<string, string[]>;

export class HttpError extends Error {
  public readonly status: number;
  public readonly cause?: unknown;
  public readonly details?: unknown;

  constructor(status: number, message?: string, options: HttpErrorOptions = {}) {
    super(message ?? getDefaultHttpErrorMessage(status));
    this.name = "HttpError";
    this.status = status;
    this.cause = options.cause;
    this.details = options.details;
  }
}

export class ValidationError extends HttpError {
  public readonly fieldErrors: FieldErrors;

  constructor(fieldErrors: FieldErrors, message?: string, options: HttpErrorOptions = {}) {
    super(400, message ?? formatFieldErrors(fieldErrors), { ...options, details: fieldErrors });
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", options: HttpErrorOptions = {}) {
    super(401, message, options);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", options: HttpErrorOptions = {}) {
    super(403, message, options);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends HttpError {
  constructor(resource = "Resource", options: HttpErrorOptions = {}) {
    super(404, `${resource} not found`, options);
    this.name = "NotFoundError";
  }
}

export const createHttpError = (
  status: number,
  message?: string,
  options?: HttpErrorOptions
): HttpError => new HttpError(status, message, options);

export const isHttpError = (error: unknown): error is HttpError =>
  error instanceof HttpError ||
  (typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status?: unknown }).status === "number");

export const getHttpStatusCode = (error: unknown, fallback = 500): number => {
  if (isHttpError(error)) {
    return error.status;
  }

  return fallback;
};

export const getHttpErrorMessage = (error: unknown, fallback = "Internal Server Error"): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const getDefaultHttpErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return "Bad Request";
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Not Found";
    case 409:
      return "Conflict";
    case 422:
      return "Unprocessable Entity";
    case 429:
      return "Too Many Requests";
    default:
      return status >= 500 ? "Internal Server Error" : "Request Error";
  }
};

export const formatFieldErrors = (errors: FieldErrors): string =>
  Object.entries(errors)
    .map(([field, messages]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      if (!messages?.length) return `${fieldName} is invalid`;
      if (messages[0] === "Required") return `${fieldName} is required`;
      return messages.join(" and ");
    })
    .join(", ");

export const isValidationError = (error: unknown): error is ValidationError =>
  error instanceof ValidationError;

export const toErrorResponse = (
  error: unknown,
  fallbackMessage = "Internal Server Error"
): { status: number; message: string; errors?: FieldErrors } => {
  const status = getHttpStatusCode(error);
  const message = getHttpErrorMessage(error, fallbackMessage);

  if (isValidationError(error)) {
    return { status, message, errors: error.fieldErrors };
  }

  return { status, message };
};

export const badRequest = (message?: string, options?: HttpErrorOptions): HttpError =>
  createHttpError(400, message, options);
export const unauthorized = (message?: string, options?: HttpErrorOptions): HttpError =>
  createHttpError(401, message, options);
export const forbidden = (message?: string, options?: HttpErrorOptions): HttpError =>
  createHttpError(403, message, options);
export const notFound = (message?: string, options?: HttpErrorOptions): HttpError =>
  createHttpError(404, message, options);
export const conflict = (message?: string, options?: HttpErrorOptions): HttpError =>
  createHttpError(409, message, options);
export const unprocessableEntity = (message?: string, options?: HttpErrorOptions): HttpError =>
  createHttpError(422, message, options);
export const tooManyRequests = (message?: string, options?: HttpErrorOptions): HttpError =>
  createHttpError(429, message, options);
export const internalServerError = (message?: string, options?: HttpErrorOptions): HttpError =>
  createHttpError(500, message, options);

export const validationError = (
  fieldErrors: FieldErrors,
  message?: string,
  options?: HttpErrorOptions
): ValidationError => new ValidationError(fieldErrors, message, options);
