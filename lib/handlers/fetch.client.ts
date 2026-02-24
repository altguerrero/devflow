"use client";

import handleFetch from "@/lib/handlers/fetch";
import { sentryClientFetchLogger } from "@/lib/loggers/sentry-client";

export const handleClientFetch: typeof handleFetch = (options) => {
  return handleFetch({
    ...options,
    logger: options.logger ?? sentryClientFetchLogger,
  });
};

export default handleClientFetch;
