import type { NextRequest } from "next/server";
import { handle, ok } from "@/lib/api";
import { assertSameOrigin } from "@/lib/auth/guard";
import { endSession } from "@/lib/auth/session";

export const POST = handle(async (request: NextRequest) => {
  assertSameOrigin(request);
  await endSession();
  return ok({ signedOut: true });
});
