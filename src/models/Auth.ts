import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "Administrator" },
    passwordHash: { type: String, required: true, select: false },
    passwordChangedAt: Date,
    lastLoginAt: Date,
  },
  { timestamps: true },
);

/*
 * Server-side sessions. The cookie holds a random token; only its SHA-256
 * hash is stored, so a database leak doesn't expose usable sessions.
 * MongoDB's TTL monitor removes expired documents.
 */
const sessionSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    adminId: { type: Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    expiresAt: { type: Date, required: true },
    lastUsedAt: { type: Date, default: Date.now },
    userAgent: { type: String, default: "" },
    ip: { type: String, default: "" },
  },
  { timestamps: true },
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/** Fixed-window counters for rate limiting, shared across serverless instances. */
const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});

rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type AdminDoc = InferSchemaType<typeof adminSchema>;
export type SessionDoc = InferSchemaType<typeof sessionSchema>;
export type RateLimitDoc = InferSchemaType<typeof rateLimitSchema>;

export const AdminModel: Model<AdminDoc> =
  (models.Admin as Model<AdminDoc>) || model<AdminDoc>("Admin", adminSchema);

export const SessionModel: Model<SessionDoc> =
  (models.Session as Model<SessionDoc>) || model<SessionDoc>("Session", sessionSchema);

export const RateLimitModel: Model<RateLimitDoc> =
  (models.RateLimit as Model<RateLimitDoc>) || model<RateLimitDoc>("RateLimit", rateLimitSchema);
