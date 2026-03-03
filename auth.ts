import api from "@/lib/api/server";
import { verifyCredentials } from "@/lib/auth/credentials";
import logger from "@/lib/logger";
import dbConnect from "@/lib/mongoose";
import { SignInSchema } from "@/lib/validations";
import type { OAuthProvider } from "@/types/auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const isSupportedOAuthProvider = (provider?: string): provider is OAuthProvider =>
  provider === "google" || provider === "github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = SignInSchema.safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        await dbConnect();
        return verifyCredentials(email, password);
      },
    }),
    GitHub,
    Google,
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.type !== "oauth") return true;
      if (!isSupportedOAuthProvider(account.provider)) return false;
      if (!account.providerAccountId || !user.email) return false;

      const oauthSyncResponse = await api.auth.signInWithOAuth({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        user: {
          email: user.email,
          name: user.name,
          image: user.image,
        },
      });

      if (!oauthSyncResponse.success || !oauthSyncResponse.data?.user?._id) {
        logger.error(
          {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            email: user.email,
            error: oauthSyncResponse.success ? undefined : oauthSyncResponse.error,
          },
          "Failed to sync OAuth sign-in with local database"
        );
        return false;
      }

      user.userId = oauthSyncResponse.data.user._id;

      return true;
    },
    async jwt({ token, user }) {
      if (user?.userId) {
        token.userId = user.userId;
        token.sub = user.userId;
      }

      return token;
    },
    async session({ session, token }) {
      if (typeof token.userId === "string") {
        session.userId = token.userId;
      }

      return session;
    },
  },
  logger: {
    error(error) {
      logger.error({ err: error }, "NextAuth error");
    },
    warn(code) {
      logger.warn({ code }, "NextAuth warning");
    },
    debug(message, metadata) {
      logger.debug({ message, metadata }, "NextAuth debug");
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      logger.info(
        {
          userId: user?.id,
          provider: account?.provider,
          isNewUser,
        },
        "User signed in"
      );
    },
    async signOut(payload) {
      const tokenUserId = "token" in payload ? payload.token?.sub : undefined;
      const sessionUserId = "session" in payload ? payload.session?.userId : undefined;
      const sessionToken = "session" in payload ? payload.session?.sessionToken : undefined;

      logger.info(
        {
          userId: tokenUserId,
          sessionUserId,
          sessionToken,
        },
        "User signed out"
      );
    },
  },
});
