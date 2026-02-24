import "server-only";

import handleFetch, { type FetchLoggerLike } from "@/lib/handlers/fetch";
import logger from "@/lib/logger";

export const handleServerFetch: typeof handleFetch = (options) => {
  return handleFetch({
    ...options,
    logger: options.logger ?? logger,
  });
};

export default handleServerFetch;
