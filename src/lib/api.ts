import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { z, ZodError } from "zod";
import { DatabaseUnavailableError } from "@/lib/db";

/*
 * Shared Route Handler plumbing: consistent JSON envelopes, error mapping and
 * body parsing. Success: { data, meta? }. Failure: { error: { message, fields? } }.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields?: Record<string, string>,
    public headers?: Record<string, string>,
  ) {
    super(message);
  }
}

export function ok<T>(data: T, init?: { status?: number; meta?: Record<string, unknown> }) {
  return NextResponse.json(
    { data, ...(init?.meta ? { meta: init.meta } : {}) },
    { status: init?.status ?? 200, headers: { "Cache-Control": "no-store" } },
  );
}

export function fail(status: number, message: string, fields?: Record<string, string>, headers?: Record<string, string>) {
  return NextResponse.json(
    { error: { message, ...(fields ? { fields } : {}) } },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

export function zodFields(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.map(String).join(".") || "_";
    fields[path] ??= issue.message;
  }
  return fields;
}

type Handler<C> = (request: NextRequest, context: C) => Promise<Response>;

/** Wraps a handler so thrown errors become safe, consistent JSON responses. */
export function handle<C>(handler: Handler<C>): Handler<C> {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ApiError) return fail(error.status, error.message, error.fields, error.headers);
      if (error instanceof ZodError) return fail(422, "Please fix the highlighted fields.", zodFields(error));
      if (error instanceof DatabaseUnavailableError) {
        console.error("[api] database unavailable", error.cause);
        return fail(503, "The service is temporarily unavailable. Please try again shortly.");
      }
      const code = (error as { code?: number })?.code;
      if (code === 11000) {
        const key = Object.keys((error as { keyValue?: object }).keyValue ?? {})[0];
        return fail(409, "A record with this value already exists.", key ? { [key]: "Already in use" } : undefined);
      }
      if ((error as { name?: string })?.name === "CastError") return fail(404, "Not found.");
      // Next.js control-flow errors (redirect, notFound, …) must propagate.
      if ((error as { digest?: string })?.digest) throw error;
      console.error("[api] unexpected error", error);
      return fail(500, "Something went wrong. Please try again.");
    }
  };
}

const MAX_JSON_BYTES = 512 * 1024;

export async function parseJson<S extends z.ZodType>(request: Request, schema: S): Promise<z.output<S>> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) throw new ApiError(415, "Send a JSON body.");
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_JSON_BYTES) throw new ApiError(413, "The request body is too large.");

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_JSON_BYTES) throw new ApiError(413, "The request body is too large.");
    body = JSON.parse(raw);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "The request body is not valid JSON.");
  }
  return schema.parse(body);
}

/** Reads a JSON object body without validating it (for merging partial updates). */
export function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  return parseJson(request, z.record(z.string(), z.unknown()));
}

export function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function paginationParams(request: NextRequest, defaults = { limit: 50 }) {
  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(params.get("limit") ?? String(defaults.limit), 10) || defaults.limit));
  return { page, limit, skip: (page - 1) * limit };
}
