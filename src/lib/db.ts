import mongoose from "mongoose";

/*
 * One cached connection per server process. Next.js dev reloads modules and
 * serverless functions reuse warm instances, so the connection promise lives
 * on globalThis instead of module scope.
 */
type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalForMongoose = globalThis as typeof globalThis & { __mongoose?: MongooseCache };
const cache: MongooseCache = (globalForMongoose.__mongoose ??= { conn: null, promise: null });

export class DatabaseUnavailableError extends Error {
  constructor(cause?: unknown) {
    super("The database is currently unavailable", { cause });
    this.name = "DatabaseUnavailableError";
  }
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn && mongoose.connection.readyState === 1) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env (see .env.example).");
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || "my-portfolio",
      // Fail fast instead of queueing queries while disconnected.
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    // Let the next request retry rather than reusing a rejected promise.
    cache.promise = null;
    throw new DatabaseUnavailableError(error);
  }
  return cache.conn;
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect();
  cache.conn = null;
  cache.promise = null;
}
