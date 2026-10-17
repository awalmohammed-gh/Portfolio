import type { NextRequest } from "next/server";
import { handle, ok } from "@/lib/api";
import { requireAdminRequest } from "@/lib/auth/guard";
import { revokeOtherSessions } from "@/lib/auth/session";
import { SessionModel } from "@/models/Auth";

export const GET = handle(async (request: NextRequest) => {
  const admin = await requireAdminRequest(request);
  const sessions = await SessionModel.find({ adminId: admin.id, expiresAt: { $gt: new Date() } })
    .sort({ lastUsedAt: -1 })
    .lean();
  return ok(
    sessions.map((session) => ({
      id: String(session._id),
      current: String(session._id) === admin.sessionId,
      userAgent: session.userAgent,
      ip: session.ip,
      createdAt: session.createdAt,
      lastUsedAt: session.lastUsedAt,
      expiresAt: session.expiresAt,
    })),
  );
});

/** Signs out every session except the current one. */
export const DELETE = handle(async (request: NextRequest) => {
  const admin = await requireAdminRequest(request);
  const revoked = await revokeOtherSessions(admin.id, admin.sessionId);
  return ok({ revoked });
});
