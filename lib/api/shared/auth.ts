import type { Fetcher } from "@/lib/api/shared/base";
import type { SignInWithOAuthInput, SignInWithOAuthResult } from "@/types/auth";

export const createAuthApi = (fetcher: Fetcher, baseUrl: string) => {
  return {
    signInWithOAuth: (payload: SignInWithOAuthInput) =>
      fetcher<SignInWithOAuthResult>({
        url: `${baseUrl}/auth/internal/signin-with-oauth`,
        method: "POST",
        body: payload,
      }),
  };
};
