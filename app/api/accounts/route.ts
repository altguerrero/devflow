import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { flattenError } from "zod";

import HTTP_STATUS from "@/constants/http-status";
import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError, badRequest, conflict, notFound } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { sanitizeAccount } from "@/lib/sanitizers/account";
import { AccountSchema } from "@/lib/validations";
import type { APIErrorResponse } from "@/types/global";

export async function GET() {
  try {
    await dbConnect();

    const accounts = await Account.find().lean();

    return NextResponse.json(
      { success: true, data: accounts.map((account) => sanitizeAccount(account)) },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const validatedData = AccountSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    const { userId, provider, providerAccountId } = validatedData.data;

    if (!isValidObjectId(userId)) {
      throw badRequest("Invalid user id");
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      throw notFound("User not found");
    }

    const existingAccount = await Account.findOne({ provider, providerAccountId }).lean();
    if (existingAccount) {
      throw conflict("Account already exists");
    }

    const newAccount = await Account.create(validatedData.data);

    return NextResponse.json(
      { success: true, data: sanitizeAccount(newAccount.toObject()) },
      { status: HTTP_STATUS.CREATED }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
