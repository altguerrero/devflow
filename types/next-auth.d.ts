import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    userId?: string;
  }

  interface Session {
    user?: DefaultSession["user"];
    userId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
  }
}
