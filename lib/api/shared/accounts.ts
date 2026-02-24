import type { Fetcher } from "@/lib/api/shared/base";
import type { AccountInput, AccountProviderLookupInput } from "@/lib/validations";

export const createAccountsApi = (fetcher: Fetcher, baseUrl: string) => {
  return {
    getAll: () => fetcher({ url: `${baseUrl}/accounts`, method: "GET" }),
    getById: (id: string) => fetcher({ url: `${baseUrl}/accounts/${id}`, method: "GET" }),
    getByProvider: (lookup: AccountProviderLookupInput) =>
      fetcher({
        url: `${baseUrl}/accounts/provider`,
        method: "POST",
        body: lookup,
      }),
    create: (accountData: AccountInput) =>
      fetcher({
        url: `${baseUrl}/accounts`,
        method: "POST",
        body: accountData,
      }),
    update: (id: string, accountData: Partial<AccountInput>) =>
      fetcher({
        url: `${baseUrl}/accounts/${id}`,
        method: "PUT",
        body: accountData,
      }),
    delete: (id: string) =>
      fetcher({
        url: `${baseUrl}/accounts/${id}`,
        method: "DELETE",
      }),
  };
};
