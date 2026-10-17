import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection, type NextRequest } from "next/server";
import { ApiError } from "@/lib/api";
import { SESSION_COOKIE } from "./constants";
import { resolveSession, type AdminIdentity } from "./session";

/**
 * For admin pages: returns the signed-in admin or redirects to the login page.
 * Deduplicated per request. Pages call this inside a <Suspense> boundary
 * because it reads cookies.
 */
export const requireAdmin = cache(async (): Promise<AdminIdentity> => {
  // Session checks compare times and query MongoDB, so they always run at request time.
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const admin = await resolveSession(token);
  if (!admin) redirect("/admin/login");
  return admin;
});

/** Returns the signed-in admin for a page, or null (no redirect). */
export const getOptionalAdmin = cache(async (): Promise<AdminIdentity | null> => {
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return resolveSession(token);
});

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Rejects cross-site state-changing requests (CSRF). Browsers send Origin on
 * every POST/PATCH/PUT/DELETE fetch; it must match the host serving the app.
 */
export function assertSameOrigin(request: NextRequest): void {
  if (SAFE_METHODS.has(request.method)) return;

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const origin = request.headers.get("origin");

  if (!origin) {
    if (request.headers.get("sec-fetch-site") === "same-origin") return;
    throw new ApiError(403, "Cross-site request blocked.");
  }

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new ApiError(403, "Cross-site request blocked.");
  }
  if (!host || originHost !== host) throw new ApiError(403, "Cross-site request blocked.");
}

/** For Route Handlers: verifies origin (for writes) and the session, or throws 401/403. */
export async function requireAdminRequest(request: NextRequest): Promise<AdminIdentity> {
  assertSameOrigin(request);
  const admin = await resolveSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!admin) throw new ApiError(401, "Please sign in to continue.");
  return admin;
}

/** For public GET endpoints that show extra (draft) data to a signed-in admin. */
export async function getAdminFromRequest(request: NextRequest): Promise<AdminIdentity | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return resolveSession(token);
}
