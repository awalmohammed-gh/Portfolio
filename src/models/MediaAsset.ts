import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const mediaAssetSchema = new Schema(
  {
    publicId: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    width: Number,
    height: Number,
    format: String,
    bytes: Number,
    alt: { type: String, default: "" },
    originalFilename: { type: String, default: "" },
  },
  { timestamps: true },
);

mediaAssetSchema.index({ createdAt: -1 });

export type MediaAssetDoc = InferSchemaType<typeof mediaAssetSchema>;

export const MediaAssetModel: Model<MediaAssetDoc> =
  (models.MediaAsset as Model<MediaAssetDoc>) || model<MediaAssetDoc>("MediaAsset", mediaAssetSchema);
