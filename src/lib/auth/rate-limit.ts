import "server-only";
import { RateLimitModel } from "@/models/Auth";

/**
 * Fixed-window rate limiter stored in MongoDB, so limits hold across
 * serverless instances (in-memory counters would reset per instance).
 */
export async function consumeRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; retryAfter: number }> {
  const now = new Date();

  const current = await RateLimitModel.findOneAndUpdate(
    { key, expiresAt: { $gt: now } },
    { $inc: { count: 1 } },
    { returnDocument: "after" },
  ).lean();

  if (current) {
    return {
      allowed: current.count <= limit,
      retryAfter: Math.max(1, Math.ceil((current.expiresAt.getTime() - now.getTime()) / 1000)),
    };
  }

  // No live window: start a new one (replaces an expired document if present).
  await RateLimitModel.updateOne(
    { key },
    { $set: { count: 1, expiresAt: new Date(now.getTime() + windowSeconds * 1000) } },
    { upsert: true },
  ).catch((error: { code?: number }) => {
    // A concurrent request created the window first; that's fine.
    if (error?.code !== 11000) throw error;
  });

  return { allowed: true, retryAfter: 0 };
}

export async function resetRateLimit(key: string): Promise<void> {
  await RateLimitModel.deleteOne({ key });
}
