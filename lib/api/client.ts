"use client";

import { createApiClient } from "@/lib/api/shared";
import handleClientFetch from "@/lib/handlers/fetch.client";

export const api = createApiClient(handleClientFetch);

export default api;
