"use server";

import { signIn } from "@/auth";
import HTTP_STATUS from "@/constants/http-status";
import { createCredentialsUser } from "@/lib/auth/credentials";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { unauthorized } from "@/lib/http-errors";
import withMongoTransaction from "@/lib/mongoose-transaction";
import { type SignInInput, SignInSchema, type SignUpInput, SignUpSchema } from "@/lib/validations";
import type { ActionResponse, ErrorResponse } from "@/types/global";
import { AuthError } from "next-auth";

const getCredentialsErrorMessage = (error: AuthError) => {
  if (error.type === "CredentialsSignin") {
    return "Invalid email or password";
  }

  return "Unable to sign in with email and password";
};

export const signUpWithCredentials = async (params: SignUpInput): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: SignUpSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server", "Unable to create account") as ErrorResponse;
  }

  const validatedParams = validationResult.params;

  if (!validatedParams) {
    return handleError(
      new Error("Sign-up payload is required"),
      "server",
      "Unable to create account"
    ) as ErrorResponse;
  }

  const { name, username, email, password } = validatedParams;

  try {
    await withMongoTransaction(async (session) => {
      await createCredentialsUser({ name, username, email, password }, session);
    });

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true, status: HTTP_STATUS.CREATED };
  } catch (error) {
    return handleError(error, "server", "Unable to create account") as ErrorResponse;
  }
};

export const signInWithCredentials = async (params: SignInInput): Promise<ActionResponse> => {
  try {
    const prepared = await action({
      params,
      schema: SignInSchema,
    });

    if (prepared instanceof Error) {
      return handleError(prepared, "server", "Unable to sign in") as ErrorResponse;
    }

    const validatedParams = prepared.params;

    if (!validatedParams) {
      return handleError(
        new Error("Sign-in payload is required"),
        "server",
        "Unable to sign in"
      ) as ErrorResponse;
    }

    try {
      await signIn("credentials", {
        email: validatedParams.email,
        password: validatedParams.password,
        redirect: false,
      });

      return { success: true };
    } catch (error) {
      if (error instanceof AuthError) {
        const message = getCredentialsErrorMessage(error);
        return handleError(unauthorized(message), "server", message) as ErrorResponse;
      }

      return handleError(error, "server", "Unable to sign in") as ErrorResponse;
    }
  } catch (error) {
    return handleError(error, "server", "Unable to sign in") as ErrorResponse;
  }
};
