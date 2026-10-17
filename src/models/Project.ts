import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";
import { projectStatuses, projectTints, publishStatuses } from "@/types/project";
import { imageSchema } from "./shared";

const roleSchema = new Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: "FaUser" },
    responsibilities: { type: [String], default: [] },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, default: "" },
    keyAreas: { type: [String], default: [] },
    roles: { type: [roleSchema], default: [] },
    technologies: { type: [String], default: [] },
    status: { type: String, enum: projectStatuses, default: "Completed" },
    icon: { type: String, default: "FaCode" },
    tint: { type: String, enum: projectTints, default: "indigo" },
    coverImage: { type: imageSchema, default: null },
    screenshots: { type: [imageSchema], default: [] },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    publishStatus: { type: String, enum: publishStatuses, default: "draft" },
    publishedAt: Date,
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

projectSchema.index({ publishStatus: 1, order: 1 });
projectSchema.index({ featured: 1, order: 1 });

export type ProjectDoc = InferSchemaType<typeof projectSchema>;

export const ProjectModel: Model<ProjectDoc> =
  (models.Project as Model<ProjectDoc>) || model<ProjectDoc>("Project", projectSchema);
