import API_ROUTES from "@/constants/api-routes";
import type { Fetcher } from "@/lib/api/shared/base";
import type { SignInWithOAuthInput, SignInWithOAuthResult } from "@/types/auth";

export const createAuthApi = (fetcher: Fetcher, baseUrl: string) => {
  return {
    signInWithOAuth: (payload: SignInWithOAuthInput) =>
      fetcher<SignInWithOAuthResult>({
        url: `${baseUrl}${API_ROUTES.AUTH.SIGN_IN_WITH_OAUTH}`,
        method: "POST",
        body: payload,
      }),
  };
};
