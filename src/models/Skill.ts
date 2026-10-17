import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";
import { imageSchema } from "./shared";

const skillCategorySchema = new Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "FaCode" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

skillCategorySchema.index({ order: 1 });

const skillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "FaCode" },
    iconImage: { type: imageSchema, default: null },
    categoryId: { type: Schema.Types.ObjectId, ref: "SkillCategory", required: true },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

skillSchema.index({ categoryId: 1, order: 1 });
skillSchema.index({ categoryId: 1, name: 1 }, { unique: true });

export type SkillCategoryDoc = InferSchemaType<typeof skillCategorySchema>;
export type SkillDoc = InferSchemaType<typeof skillSchema>;

export const SkillCategoryModel: Model<SkillCategoryDoc> =
  (models.SkillCategory as Model<SkillCategoryDoc>) ||
  model<SkillCategoryDoc>("SkillCategory", skillCategorySchema);

export const SkillModel: Model<SkillDoc> =
  (models.Skill as Model<SkillDoc>) || model<SkillDoc>("Skill", skillSchema);
