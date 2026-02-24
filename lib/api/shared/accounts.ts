import API_ROUTES from "@/constants/api-routes";
import type { Fetcher } from "@/lib/api/shared/base";
import type { AccountInput, AccountProviderLookupInput } from "@/lib/validations";

export const createAccountsApi = (fetcher: Fetcher, baseUrl: string) => {
  return {
    getAll: () => fetcher({ url: `${baseUrl}${API_ROUTES.ACCOUNTS.ROOT}`, method: "GET" }),
    getById: (id: string) =>
      fetcher({ url: `${baseUrl}${API_ROUTES.ACCOUNTS.BY_ID(id)}`, method: "GET" }),
    getByProvider: (lookup: AccountProviderLookupInput) =>
      fetcher({
        url: `${baseUrl}${API_ROUTES.ACCOUNTS.BY_PROVIDER}`,
        method: "POST",
        body: lookup,
      }),
    create: (accountData: AccountInput) =>
      fetcher({
        url: `${baseUrl}${API_ROUTES.ACCOUNTS.ROOT}`,
        method: "POST",
        body: accountData,
      }),
    update: (id: string, accountData: Partial<AccountInput>) =>
      fetcher({
        url: `${baseUrl}${API_ROUTES.ACCOUNTS.BY_ID(id)}`,
        method: "PUT",
        body: accountData,
      }),
    delete: (id: string) =>
      fetcher({
        url: `${baseUrl}${API_ROUTES.ACCOUNTS.BY_ID(id)}`,
        method: "DELETE",
      }),
  };
};
