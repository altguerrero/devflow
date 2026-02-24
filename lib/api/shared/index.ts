import { createAccountsApi } from "@/lib/api/shared/accounts";
import { type Fetcher, getApiBaseUrl } from "@/lib/api/shared/base";
import { createUsersApi } from "@/lib/api/shared/users";

export { getApiBaseUrl } from "@/lib/api/shared/base";

export const createApiClient = (fetcher: Fetcher, baseUrl = getApiBaseUrl()) => {
  return {
    users: createUsersApi(fetcher, baseUrl),
    accounts: createAccountsApi(fetcher, baseUrl),
  };
};

export type APIClient = ReturnType<typeof createApiClient>;
