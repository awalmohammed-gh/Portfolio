import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";
import { imageSchema } from "./shared";

const experienceSchema = new Schema(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    companyUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    employmentType: { type: String, default: "" },
    startDate: { type: String, required: true },
    endDate: { type: String, default: "" },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    logo: { type: imageSchema, default: null },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

experienceSchema.index({ visible: 1, order: 1 });

export type ExperienceDoc = InferSchemaType<typeof experienceSchema>;

export const ExperienceModel: Model<ExperienceDoc> =
  (models.Experience as Model<ExperienceDoc>) || model<ExperienceDoc>("Experience", experienceSchema);
