import type { NextRequest } from "next/server";
import { ApiError, handle, ok, parseJson } from "@/lib/api";
import { requireAdminRequest } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db";
import { profileSchema } from "@/lib/validations/auth";
import { AdminModel } from "@/models/Auth";

export const GET = handle(async (request: NextRequest) => {
  const admin = await requireAdminRequest(request);
  return ok({ id: admin.id, name: admin.name, email: admin.email });
});

/** Updates the admin's name and email. */
export const PATCH = handle(async (request: NextRequest) => {
  const admin = await requireAdminRequest(request);
  const input = await parseJson(request, profileSchema);
  await connectToDatabase();

  const clash = await AdminModel.exists({ email: input.email, _id: { $ne: admin.id } });
  if (clash) throw new ApiError(409, "That email is already in use.", { email: "Already in use" });

  await AdminModel.updateOne({ _id: admin.id }, { $set: input });
  return ok({ id: admin.id, ...input });
});
