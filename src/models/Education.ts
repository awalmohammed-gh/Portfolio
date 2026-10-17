import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";
import { qualificationStatuses } from "@/types/education";
import { imageSchema } from "./shared";

const educationSchema = new Schema(
  {
    level: { type: String, required: true },
    icon: { type: String, default: "LuGraduationCap" },
    institution: { type: String, required: true, trim: true },
    institutionShort: { type: String, default: "" },
    qualification: {
      title: { type: String, required: true },
      shortTitle: { type: String, required: true },
      status: { type: String, enum: qualificationStatuses, default: "completed" },
      statusLabel: { type: String, required: true },
    },
    course: { type: String, default: "" },
    startDate: { type: String, default: "" },
    completionYear: { type: Number, default: null },
    note: { type: String, default: "" },
    certificate: { type: imageSchema, default: null },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

educationSchema.index({ visible: 1, order: 1 });

export type EducationDoc = InferSchemaType<typeof educationSchema>;

export const EducationModel: Model<EducationDoc> =
  (models.Education as Model<EducationDoc>) || model<EducationDoc>("Education", educationSchema);
