import "server-only";

import { createApiClient } from "@/lib/api/shared";
import handleServerFetch from "@/lib/handlers/fetch.server";

export const api = createApiClient(handleServerFetch);

export default api;
