import { PASSWORD_SALT_ROUNDS } from "@/constants/security";
import Account from "@/database/account.model";
import User from "@/database/user.model";
import { conflict } from "@/lib/http-errors";
import { compare, hash } from "bcryptjs";
import type { ClientSession, Types } from "mongoose";

export type CreateCredentialsUserInput = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type CredentialsAuthUser = {
  id: string;
  userId: string;
  email: string;
  name: string;
  image?: string;
};

export const createCredentialsUser = async (
  { name, username, email, password }: CreateCredentialsUserInput,
  session: ClientSession
): Promise<{ userId: Types.ObjectId }> => {
  const existingUser = await User.findOne({ email }).session(session);
  if (existingUser) {
    throw conflict("User already exists");
  }

  const existingUsername = await User.findOne({ username }).session(session);
  if (existingUsername) {
    throw conflict("Username already exists");
  }

  const hashedPassword = await hash(password, PASSWORD_SALT_ROUNDS);

  const [newUser] = await User.create(
    [
      {
        name,
        username,
        email,
        password: hashedPassword,
      },
    ],
    { session }
  );

  await Account.create(
    [
      {
        userId: newUser._id,
        provider: "credentials",
        providerAccountId: email,
        type: "credentials",
      },
    ],
    { session }
  );

  return { userId: newUser._id };
};

export const verifyCredentials = async (
  email: string,
  password: string
): Promise<CredentialsAuthUser | null> => {
  const account = await Account.findOne({
    provider: "credentials",
    providerAccountId: email,
    type: "credentials",
  }).lean();

  if (!account) return null;

  const user = await User.findById(account.userId).select("+password").lean();
  if (!user?.password) return null;

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) return null;

  return {
    id: user._id.toString(),
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    image: user.image,
  };
};
