import type handleFetch from "@/lib/handlers/fetch";

const DEFAULT_API_BASE_URL = "http://localhost:3000/api";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const getApiBaseUrl = () => {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL);
};

export type Fetcher = typeof handleFetch;
