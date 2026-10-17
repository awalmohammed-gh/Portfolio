import type { NextRequest } from "next/server";
import { ApiError, handle, ok, parseJson } from "@/lib/api";
import { requireAdminRequest } from "@/lib/auth/guard";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { consumeRateLimit } from "@/lib/auth/rate-limit";
import { revokeOtherSessions } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db";
import { passwordChangeSchema } from "@/lib/validations/auth";
import { AdminModel } from "@/models/Auth";

/** Changes the password and signs out every other session. */
export const POST = handle(async (request: NextRequest) => {
  const admin = await requireAdminRequest(request);
  const input = await parseJson(request, passwordChangeSchema);
  await connectToDatabase();

  const limit = await consumeRateLimit(`password:${admin.id}`, 5, 15 * 60);
  if (!limit.allowed) throw new ApiError(429, "Too many attempts. Try again later.");

  const record = await AdminModel.findById(admin.id).select("+passwordHash").lean();
  if (!(await verifyPassword(record?.passwordHash, input.currentPassword))) {
    throw new ApiError(422, "Please fix the highlighted fields.", { currentPassword: "Current password is incorrect" });
  }

  await AdminModel.updateOne(
    { _id: admin.id },
    { $set: { passwordHash: await hashPassword(input.newPassword), passwordChangedAt: new Date() } },
  );
  const revoked = await revokeOtherSessions(admin.id, admin.sessionId);
  return ok({ changed: true, revokedSessions: revoked });
});
