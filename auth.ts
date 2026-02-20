import logger from "@/lib/logger";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
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
