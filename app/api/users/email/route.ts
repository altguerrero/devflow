import { NextResponse } from "next/server";
import { z } from "zod";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { badRequest, notFound } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { sanitizeUser } from "@/lib/sanitizers/user";
import type { APIErrorResponse } from "@/types/global";

const EmailQuerySchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Please provide a valid email")),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedQuery = EmailQuerySchema.safeParse({
      email: body?.email ?? "",
    });

    if (!parsedQuery.success) {
      throw badRequest(parsedQuery.error.issues[0]?.message ?? "Email is required");
    }

    await dbConnect();

    const user = await User.findOne({ email: parsedQuery.data.email }).lean();

    if (!user) {
      throw notFound("User not found");
    }

    return NextResponse.json({ success: true, data: sanitizeUser(user) }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
