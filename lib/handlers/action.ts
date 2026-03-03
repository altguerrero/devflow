"use server";

import { auth } from "@/auth";
import { UnauthorizedError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import type { Session } from "next-auth";
import { ZodError, type ZodSchema, flattenError } from "zod";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

type ActionContext<T> = {
  params?: T;
  session: Session | null;
};

type ActionFailure = ValidationError | UnauthorizedError | Error;

const action = async <T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>): Promise<ActionContext<T> | ActionFailure> => {
  if (schema) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = flattenError(error).fieldErrors as Record<string, string[]>;
        return new ValidationError(fieldErrors);
      }

      return new Error("Schema validation failed");
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = (await auth()) as Session | null;

    if (!session) {
      return new UnauthorizedError();
    }
  }

  await dbConnect();

  return { params, session };
};

export default action;
