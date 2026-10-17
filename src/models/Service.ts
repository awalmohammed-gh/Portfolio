import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const serviceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, default: "FaCode" },
    includes: { type: [String], default: [] },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

serviceSchema.index({ visible: 1, order: 1 });

export type ServiceDoc = InferSchemaType<typeof serviceSchema>;

export const ServiceModel: Model<ServiceDoc> =
  (models.Service as Model<ServiceDoc>) || model<ServiceDoc>("Service", serviceSchema);
