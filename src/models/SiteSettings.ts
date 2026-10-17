import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";
import { imageSchema } from "./shared";

/** Singleton document (key "site") holding site-wide settings. */
const siteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "site" },
    siteName: { type: String, required: true },
    jobTitle: { type: String, default: "" },
    siteDescription: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    keywords: { type: [String], default: [] },
    canonicalUrl: { type: String, default: "" },
    logo: { type: imageSchema, default: null },
    favicon: { type: imageSchema, default: null },
    ogImage: { type: imageSchema, default: null },
    email: { type: String, default: "" },
    phones: {
      type: [new Schema({ display: String, number: String }, { _id: false })],
      default: [],
    },
    location: { type: String, default: "" },
    socialLinks: {
      type: [new Schema({ label: String, url: String, icon: String }, { _id: false })],
      default: [],
    },
    contactFormEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type SiteSettingsDoc = InferSchemaType<typeof siteSettingsSchema>;

export const SiteSettingsModel: Model<SiteSettingsDoc> =
  (models.SiteSettings as Model<SiteSettingsDoc>) ||
  model<SiteSettingsDoc>("SiteSettings", siteSettingsSchema);
