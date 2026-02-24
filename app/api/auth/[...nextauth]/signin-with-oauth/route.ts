import { OAuthSignInSchema, signInWithOAuth } from "@/lib/auth/oauth-signin";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import type { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import { flattenError } from "zod";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const validatedData = OAuthSignInSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    const transactionResult = await signInWithOAuth(validatedData.data);

    return NextResponse.json(
      { success: true, data: transactionResult },
      { status: transactionResult.isNewAccount ? 201 : 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
