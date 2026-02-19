import { NextResponse } from "next/server";
import { flattenError } from "zod";
import { hash } from "bcryptjs";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { conflict, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { sanitizeUser } from "@/lib/sanitizers/user";
import { UserSchema } from "@/lib/validations";
import type { APIErrorResponse } from "@/types/global";

const PASSWORD_SALT_ROUNDS = 12;

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find().lean();

    return NextResponse.json({ success: true, data: users.map(sanitizeUser) }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    const { email, username } = validatedData.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw conflict("User already exists");

    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw conflict("Username already exists");

    const hashedPassword = await hash(validatedData.data.password, PASSWORD_SALT_ROUNDS);

    const newUser = await User.create({ ...validatedData.data, password: hashedPassword });
    const safeUser = sanitizeUser(newUser.toObject());

    return NextResponse.json({ success: true, data: safeUser }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
