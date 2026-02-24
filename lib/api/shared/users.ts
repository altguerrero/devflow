import API_ROUTES from "@/constants/api-routes";
import type { Fetcher } from "@/lib/api/shared/base";
import type { UserInput } from "@/lib/validations";

export const createUsersApi = (fetcher: Fetcher, baseUrl: string) => {
  return {
    getAll: () => fetcher({ url: `${baseUrl}${API_ROUTES.USERS.ROOT}`, method: "GET" }),
    getById: (id: string) =>
      fetcher({ url: `${baseUrl}${API_ROUTES.USERS.BY_ID(id)}`, method: "GET" }),
    getByEmail: (email: string) =>
      fetcher({
        url: `${baseUrl}${API_ROUTES.USERS.BY_EMAIL}`,
        method: "POST",
        body: { email },
      }),
    create: (userData: UserInput) =>
      fetcher({
        url: `${baseUrl}${API_ROUTES.USERS.ROOT}`,
        method: "POST",
        body: userData,
      }),
    update: (id: string, userData: Partial<UserInput>) =>
      fetcher({
        url: `${baseUrl}${API_ROUTES.USERS.BY_ID(id)}`,
        method: "PUT",
        body: userData,
      }),
    delete: (id: string) =>
      fetcher({
        url: `${baseUrl}${API_ROUTES.USERS.BY_ID(id)}`,
        method: "DELETE",
      }),
  };
};
