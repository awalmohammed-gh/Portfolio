import { Schema } from "mongoose";

/** Embedded image reference: a static /public path or a Cloudinary upload. */
export const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: String,
    width: Number,
    height: Number,
    alt: { type: String, default: "" },
  },
  { _id: false },
);
