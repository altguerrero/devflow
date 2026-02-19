import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { hash } from "bcryptjs";
import { flattenError } from "zod";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { badRequest, conflict, notFound, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { sanitizeUser } from "@/lib/sanitizers/user";
import { UserSchema } from "@/lib/validations";
import type { APIErrorResponse } from "@/types/global";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const PASSWORD_SALT_ROUNDS = 12;
const UpdateUserSchema = UserSchema.partial();

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      throw badRequest("Invalid user id");
    }

    await dbConnect();

    const user = await User.findById(id).lean();

    if (!user) {
      throw notFound("User not found");
    }

    return NextResponse.json({ success: true, data: sanitizeUser(user) }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      throw badRequest("Invalid user id");
    }

    const body = await request.json();

    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      throw badRequest("At least one field is required for update");
    }

    const validatedData = UpdateUserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    await dbConnect();

    const { email, username, password } = validatedData.data;

    if (email) {
      const existingUserByEmail = await User.findOne({ email, _id: { $ne: id } });
      if (existingUserByEmail) throw conflict("Email already exists");
    }

    if (username) {
      const existingUserByUsername = await User.findOne({ username, _id: { $ne: id } });
      if (existingUserByUsername) throw conflict("Username already exists");
    }

    const updatePayload = { ...validatedData.data };

    if (password) {
      updatePayload.password = await hash(password, PASSWORD_SALT_ROUNDS);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedUser) {
      throw notFound("User not found");
    }

    return NextResponse.json({ success: true, data: sanitizeUser(updatedUser) }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      throw badRequest("Invalid user id");
    }

    await dbConnect();

    const deletedUser = await User.findByIdAndDelete(id).lean();

    if (!deletedUser) {
      throw notFound("User not found");
    }

    return NextResponse.json({ success: true, data: sanitizeUser(deletedUser) }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
