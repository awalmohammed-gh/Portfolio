import { connection } from "next/server";
import { connectToDatabase } from "@/lib/db";

/** Liveness check for deployments: reports whether MongoDB is reachable. */
export async function GET() {
  await connection();
  try {
    const mongoose = await connectToDatabase();
    await mongoose.connection.db?.admin().ping();
    return Response.json({ status: "ok", database: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { status: "degraded", database: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
