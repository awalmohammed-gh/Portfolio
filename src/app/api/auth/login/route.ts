import type { NextRequest } from "next/server";
import { ApiError, clientIp, handle, ok, parseJson } from "@/lib/api";
import { assertSameOrigin } from "@/lib/auth/guard";
import { verifyPassword } from "@/lib/auth/password";
import { consumeRateLimit, resetRateLimit } from "@/lib/auth/rate-limit";
import { startSession } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import { AdminModel } from "@/models/Auth";

const WINDOW_SECONDS = 15 * 60;

export const POST = handle(async (request: NextRequest) => {
  assertSameOrigin(request);
  const { email, password } = await parseJson(request, loginSchema);
  await connectToDatabase();

  const ip = clientIp(request);
  const [byIp, byEmail] = await Promise.all([
    consumeRateLimit(`login:ip:${ip}`, 20, WINDOW_SECONDS),
    consumeRateLimit(`login:email:${email}`, 5, WINDOW_SECONDS),
  ]);
  if (!byIp.allowed || !byEmail.allowed) {
    const retryAfter = Math.max(byIp.retryAfter, byEmail.retryAfter);
    throw new ApiError(
      429,
      `Too many sign-in attempts. Try again in ${Math.ceil(retryAfter / 60)} minute(s).`,
      undefined,
      { "Retry-After": String(retryAfter) },
    );
  }

  const admin = await AdminModel.findOne({ email }).select("+passwordHash").lean();
  const valid = await verifyPassword(admin?.passwordHash, password);
  if (!admin || !valid) {
    // Same message for unknown email and wrong password.
    throw new ApiError(401, "Incorrect email or password.");
  }

  await resetRateLimit(`login:email:${email}`);
  await AdminModel.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } });
  await startSession(String(admin._id), {
    userAgent: request.headers.get("user-agent") ?? "",
    ip,
  });

  return ok({ name: admin.name, email: admin.email });
});
