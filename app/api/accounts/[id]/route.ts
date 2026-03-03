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

interface RouteContext {
  params: Promise<{ id: string }>;
}

const UpdateAccountSchema = AccountSchema.partial();

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      throw badRequest("Invalid account id");
    }

    await dbConnect();

    const account = await Account.findById(id).lean();

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

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      throw badRequest("Invalid account id");
    }

    const body = await request.json();

    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      throw badRequest("At least one field is required for update");
    }

    const validatedData = UpdateAccountSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    await dbConnect();

    const currentAccount = await Account.findById(id).lean();

    if (!currentAccount) {
      throw notFound("Account not found");
    }

    const { userId, provider, providerAccountId } = validatedData.data;

    if (userId) {
      if (!isValidObjectId(userId)) {
        throw badRequest("Invalid user id");
      }

      const user = await User.findById(userId).lean();
      if (!user) {
        throw notFound("User not found");
      }
    }

    const nextProvider = provider ?? currentAccount.provider;
    const nextProviderAccountId = providerAccountId ?? currentAccount.providerAccountId;

    const existingAccount = await Account.findOne({
      provider: nextProvider,
      providerAccountId: nextProviderAccountId,
      _id: { $ne: id },
    }).lean();

    if (existingAccount) {
      throw conflict("Account already exists");
    }

    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData.data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedAccount) {
      throw notFound("Account not found");
    }

    return NextResponse.json(
      { success: true, data: sanitizeAccount(updatedAccount) },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      throw badRequest("Invalid account id");
    }

    await dbConnect();

    const deletedAccount = await Account.findByIdAndDelete(id).lean();

    if (!deletedAccount) {
      throw notFound("Account not found");
    }

    return NextResponse.json(
      { success: true, data: sanitizeAccount(deletedAccount) },
      { status: HTTP_STATUS.OK }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
