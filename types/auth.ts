export const OAUTH_PROVIDERS = ["google", "github"] as const;

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export type SignInWithOAuthInput = {
  provider: OAuthProvider;
  providerAccountId: string;
  user: {
    email: string;
    name?: string | null;
    image?: string | null;
  };
};

export type SignInWithOAuthResult = {
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
    image?: string;
  };
  account: {
    _id: string;
    userId: string;
    provider: OAuthProvider;
    providerAccountId: string;
    type: string;
  };
  isNewUser: boolean;
  isNewAccount: boolean;
};
