import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { AdminModel, SessionModel } from "@/models/Auth";
import { SESSION_COOKIE, SESSION_TTL_SECONDS } from "./constants";

export type AdminIdentity = {
  id: string;
  email: string;
  name: string;
  sessionId: string;
};

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Creates a session and sets the HTTP-only cookie. Call from a Route Handler. */
export async function startSession(
  adminId: string,
  meta: { userAgent: string; ip: string },
): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  await SessionModel.create({
    tokenHash: hashToken(token),
    adminId,
    expiresAt,
    userAgent: meta.userAgent.slice(0, 300),
    ip: meta.ip.slice(0, 64),
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Looks up a session token. Returns null for unknown, expired or orphaned sessions. */
export async function resolveSession(token: string | undefined): Promise<AdminIdentity | null> {
  if (!token || token.length > 128) return null;

  await connectToDatabase();
  const session = await SessionModel.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!session) return null;

  const admin = await AdminModel.findById(session.adminId).select({ email: 1, name: 1 }).lean();
  if (!admin) return null;

  // Touch at most every 5 minutes to keep writes cheap.
  if (Date.now() - new Date(session.lastUsedAt ?? 0).getTime() > 5 * 60 * 1000) {
    await SessionModel.updateOne({ _id: session._id }, { $set: { lastUsedAt: new Date() } });
  }

  return {
    id: String(admin._id),
    email: admin.email,
    name: admin.name ?? "Administrator",
    sessionId: String(session._id),
  };
}

/** Deletes the current session and clears the cookie. Call from a Route Handler. */
export async function endSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await connectToDatabase();
    await SessionModel.deleteOne({ tokenHash: hashToken(token) });
  }
  store.delete({ name: SESSION_COOKIE, path: "/" });
}

/** Revokes every session for the admin except the one given. */
export async function revokeOtherSessions(adminId: string, keepSessionId: string): Promise<number> {
  const result = await SessionModel.deleteMany({ adminId, _id: { $ne: keepSessionId } });
  return result.deletedCount ?? 0;
}
