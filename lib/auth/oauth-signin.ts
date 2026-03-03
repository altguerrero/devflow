import Account, { type IAccount } from "@/database/account.model";
import User, { type IUser } from "@/database/user.model";
import { notFound } from "@/lib/http-errors";
import withMongoTransaction from "@/lib/mongoose-transaction";
import { sanitizeAccount } from "@/lib/sanitizers/account";
import { sanitizeUser } from "@/lib/sanitizers/user";
import { OAUTH_PROVIDERS, type OAuthProvider } from "@/types/auth";
import type { ClientSession, Types } from "mongoose";
import slugify from "slugify";
import { z } from "zod";

const OAUTH_USERNAME_MIN_LENGTH = 3;
const OAUTH_USERNAME_MAX_LENGTH = 20;
const MAX_USERNAME_ATTEMPTS = 50;

export const OAuthSignInSchema = z.object({
  provider: z.enum(OAUTH_PROVIDERS),
  providerAccountId: z.string().trim().min(1, "Provider account id is required"),
  user: z.object({
    email: z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address")),
    name: z.string().trim().optional().nullable(),
    image: z.string().trim().optional().nullable(),
  }),
});

export type OAuthSignInInput = z.infer<typeof OAuthSignInSchema>;

type TimestampedDoc = {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
};

type SafeOAuthUser = Omit<IUser & TimestampedDoc, "password" | "__v">;
type SafeOAuthAccount = Omit<
  IAccount & TimestampedDoc,
  "accessToken" | "refreshToken" | "idToken" | "__v"
>;

export type OAuthSignInResult = {
  user: SafeOAuthUser;
  account: Omit<SafeOAuthAccount, "provider"> & { provider: OAuthProvider };
  isNewUser: boolean;
  isNewAccount: boolean;
};

const normalizeOptionalString = (value?: string | null) => {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
};

const buildUsernameBase = (name?: string, email?: string) => {
  const source =
    normalizeOptionalString(name) ?? normalizeOptionalString(email?.split("@")[0]) ?? "user";
  const normalized = slugify(source, {
    lower: true,
    strict: true,
    trim: true,
    replacement: "_",
  })
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");

  const fallback = normalized || "user";
  const padded =
    fallback.length >= OAUTH_USERNAME_MIN_LENGTH
      ? fallback
      : `${fallback}${"user".slice(0, OAUTH_USERNAME_MIN_LENGTH - fallback.length)}`;

  return padded.slice(0, OAUTH_USERNAME_MAX_LENGTH);
};

const buildUsernameCandidate = (base: string, attempt: number) => {
  if (attempt === 0) return base;

  const suffix = `_${attempt + 1}`;
  const maxBaseLength = OAUTH_USERNAME_MAX_LENGTH - suffix.length;
  return `${base.slice(0, Math.max(maxBaseLength, 1))}${suffix}`;
};

const findAvailableUsername = async (base: string, session: ClientSession): Promise<string> => {
  for (let attempt = 0; attempt < MAX_USERNAME_ATTEMPTS; attempt += 1) {
    const username = buildUsernameCandidate(base, attempt);
    const exists = await User.exists({ username }).session(session);

    if (!exists) return username;
  }

  throw new Error("Unable to generate a unique username");
};

export const signInWithOAuth = async (input: OAuthSignInInput): Promise<OAuthSignInResult> => {
  const { provider, providerAccountId, user } = input;
  const incomingName = normalizeOptionalString(user.name) ?? user.email.split("@")[0];
  const incomingImage = normalizeOptionalString(user.image);

  const transactionResult = await withMongoTransaction(async (session) => {
    const existingAccount = await Account.findOne({ provider, providerAccountId }).session(session);

    if (existingAccount) {
      const existingUser = await User.findById(existingAccount.userId).session(session);

      if (!existingUser) {
        throw notFound("User linked to OAuth account not found");
      }

      let shouldSaveUser = false;

      if (!existingUser.name && incomingName) {
        existingUser.name = incomingName;
        shouldSaveUser = true;
      }

      if (!existingUser.image && incomingImage) {
        existingUser.image = incomingImage;
        shouldSaveUser = true;
      }

      if (shouldSaveUser) {
        await existingUser.save({ session });
      }

      const safeAccount = sanitizeAccount(existingAccount.toObject());

      return {
        user: sanitizeUser(existingUser.toObject()),
        account: { ...safeAccount, provider },
        isNewUser: false,
        isNewAccount: false,
      };
    }

    let dbUser = await User.findOne({ email: user.email }).session(session);
    let isNewUser = false;

    if (!dbUser) {
      const usernameBase = buildUsernameBase(incomingName, user.email);
      const username = await findAvailableUsername(usernameBase, session);

      dbUser = await User.create(
        [
          {
            name: incomingName,
            email: user.email,
            username,
            image: incomingImage,
          } satisfies Partial<IUser>,
        ],
        { session }
      ).then(([createdUser]) => createdUser);

      isNewUser = true;
    } else {
      let shouldSaveUser = false;

      if (!dbUser.name && incomingName) {
        dbUser.name = incomingName;
        shouldSaveUser = true;
      }

      if (!dbUser.image && incomingImage) {
        dbUser.image = incomingImage;
        shouldSaveUser = true;
      }

      if (shouldSaveUser) {
        await dbUser.save({ session });
      }
    }

    if (!dbUser) {
      throw new Error("OAuth sign-in failed to resolve user record");
    }

    const newAccount = await Account.create(
      [
        {
          userId: dbUser._id,
          provider,
          providerAccountId,
          type: "oauth",
        },
      ],
      { session }
    ).then(([createdAccount]) => createdAccount);

    const safeAccount = sanitizeAccount(newAccount.toObject());

    return {
      user: sanitizeUser(dbUser.toObject()),
      account: { ...safeAccount, provider },
      isNewUser,
      isNewAccount: true,
    };
  });

  if (!transactionResult) {
    throw new Error("OAuth sign-in transaction completed without a response payload");
  }

  return transactionResult;
};
