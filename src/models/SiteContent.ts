import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

/*
 * One document per editable page section ("hero", "about", ...). `data` is
 * validated against the section's Zod schema (lib/validations/content.ts) on
 * every write and read, so new sections need a schema, not a new collection.
 */
const siteContentSchema = new Schema(
  {
    section: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false },
);

export type SiteContentDoc = InferSchemaType<typeof siteContentSchema>;

export const SiteContentModel: Model<SiteContentDoc> =
  (models.SiteContent as Model<SiteContentDoc>) ||
  model<SiteContentDoc>("SiteContent", siteContentSchema);
