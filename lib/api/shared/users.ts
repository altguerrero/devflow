import type { Fetcher } from "@/lib/api/shared/base";
import type { UserInput } from "@/lib/validations";

export const createUsersApi = (fetcher: Fetcher, baseUrl: string) => {
  return {
    getAll: () => fetcher({ url: `${baseUrl}/users`, method: "GET" }),
    getById: (id: string) => fetcher({ url: `${baseUrl}/users/${id}`, method: "GET" }),
    getByEmail: (email: string) =>
      fetcher({
        url: `${baseUrl}/users/email`,
        method: "POST",
        body: { email },
      }),
    create: (userData: UserInput) =>
      fetcher({
        url: `${baseUrl}/users`,
        method: "POST",
        body: userData,
      }),
    update: (id: string, userData: Partial<UserInput>) =>
      fetcher({
        url: `${baseUrl}/users/${id}`,
        method: "PUT",
        body: userData,
      }),
    delete: (id: string) =>
      fetcher({
        url: `${baseUrl}/users/${id}`,
        method: "DELETE",
      }),
  };
};
