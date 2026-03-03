import { NextResponse } from "next/server";
import { flattenError } from "zod";

import HTTP_STATUS from "@/constants/http-status";
import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { ValidationError, notFound } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { sanitizeAccount } from "@/lib/sanitizers/account";
import { AccountProviderLookupSchema } from "@/lib/validations";
import type { APIErrorResponse } from "@/types/global";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = AccountProviderLookupSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    await dbConnect();

    const account = await Account.findOne(validatedData.data).lean();

    if (!account) {
      throw notFound("Account not found");
    }

    return NextResponse.json(
      { success: true, data: sanitizeAccount(account) },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
