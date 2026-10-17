import "server-only";
import type { z } from "zod";
import { ApiError } from "@/lib/api";
import { tags } from "@/lib/cache-tags";
import type { CrudConfig } from "@/lib/crud";
import {
  toAdminEducation,
  toAdminExperience,
  toAdminProject,
  toAdminService,
  toAdminSkill,
  toEducation,
  toExperience,
  toProject,
  toService,
  toSkill,
  toSkillCategory,
} from "@/lib/data/dto";
import { slugify } from "@/lib/validations/common";
import {
  educationSchema,
  experienceSchema,
  projectSchema,
  serviceSchema,
  skillCategorySchema,
  skillSchema,
} from "@/lib/validations/resources";
import { EducationModel, type EducationDoc } from "@/models/Education";
import { ExperienceModel, type ExperienceDoc } from "@/models/Experience";
import { ProjectModel, type ProjectDoc } from "@/models/Project";
import { ServiceModel, type ServiceDoc } from "@/models/Service";
import { SkillCategoryModel, SkillModel, type SkillCategoryDoc, type SkillDoc } from "@/models/Skill";

const bool = (value: string) => value === "true";

async function uniqueSlug(base: string, excludeId?: unknown): Promise<string> {
  const root = slugify(base) || "project";
  let candidate = root;
  for (let n = 2; ; n++) {
    const clash = await ProjectModel.exists({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
    if (!clash) return candidate;
    candidate = `${root}-${n}`;
  }
}

type ProjectInput = z.output<typeof projectSchema>;

export const projectResource: CrudConfig<ProjectDoc, ProjectInput> = {
  label: "Project",
  model: ProjectModel,
  schema: projectSchema,
  tag: tags.projects,
  toAdmin: toAdminProject,
  toPublic: toProject,
  publicFilter: { publishStatus: "published" },
  searchFields: ["title", "category", "summary", "technologies"],
  filters: {
    publishStatus: (value) => value,
    featured: bool,
    category: (value) => value,
    status: (value) => value,
  },
  sortFields: ["order", "title", "createdAt", "updatedAt", "publishedAt"],
  defaultSort: { order: 1, createdAt: 1 },
  async prepare(input, existing) {
    const slug = await uniqueSlug(input.slug || input.title, existing?._id);
    const publishedAt =
      input.publishStatus === "published" ? (existing?.publishedAt ?? new Date()) : null;
    return { slug, publishedAt, coverImage: input.coverImage ?? null };
  },
};

type CategoryInput = z.output<typeof skillCategorySchema>;

export const skillCategoryResource: CrudConfig<SkillCategoryDoc, CategoryInput> = {
  label: "Skill category",
  model: SkillCategoryModel,
  schema: skillCategorySchema,
  tag: tags.skills,
  toAdmin: toSkillCategory,
  toPublic: toSkillCategory,
  publicFilter: {},
  searchFields: ["title", "description"],
  sortFields: ["order", "title", "updatedAt"],
  defaultSort: { order: 1, createdAt: 1 },
  async beforeDelete(doc) {
    const inUse = await SkillModel.countDocuments({ categoryId: doc._id });
    if (inUse > 0) {
      throw new ApiError(409, `Move or delete the ${inUse} skill${inUse === 1 ? "" : "s"} in this category first.`);
    }
  },
};

type SkillInput = z.output<typeof skillSchema>;

export const skillResource: CrudConfig<SkillDoc, SkillInput> = {
  label: "Skill",
  model: SkillModel,
  schema: skillSchema,
  tag: tags.skills,
  toAdmin: toAdminSkill,
  toPublic: toSkill,
  publicFilter: { visible: true },
  searchFields: ["name"],
  filters: { categoryId: (value) => value, visible: bool },
  sortFields: ["order", "name", "updatedAt"],
  defaultSort: { order: 1, createdAt: 1 },
  async prepare(input) {
    if (!(await SkillCategoryModel.exists({ _id: input.categoryId }))) {
      throw new ApiError(422, "Please fix the highlighted fields.", { categoryId: "Choose a category" });
    }
    return { iconImage: input.iconImage ?? null };
  },
};

type ServiceInput = z.output<typeof serviceSchema>;

export const serviceResource: CrudConfig<ServiceDoc, ServiceInput> = {
  label: "Service",
  model: ServiceModel,
  schema: serviceSchema,
  tag: tags.services,
  toAdmin: toAdminService,
  toPublic: toService,
  publicFilter: { visible: true },
  searchFields: ["title", "description"],
  filters: { visible: bool },
  sortFields: ["order", "title", "updatedAt"],
  defaultSort: { order: 1, createdAt: 1 },
};

type EducationInput = z.output<typeof educationSchema>;

export const educationResource: CrudConfig<EducationDoc, EducationInput> = {
  label: "Education entry",
  model: EducationModel,
  schema: educationSchema,
  tag: tags.education,
  toAdmin: toAdminEducation,
  toPublic: toEducation,
  publicFilter: { visible: true },
  searchFields: ["institution", "qualification.title", "level"],
  filters: { visible: bool },
  sortFields: ["order", "institution", "updatedAt"],
  defaultSort: { order: 1, createdAt: 1 },
  prepare: (input) => ({ certificate: input.certificate ?? null, completionYear: input.completionYear ?? null }),
};

type ExperienceInput = z.output<typeof experienceSchema>;

export const experienceResource: CrudConfig<ExperienceDoc, ExperienceInput> = {
  label: "Experience entry",
  model: ExperienceModel,
  schema: experienceSchema,
  tag: tags.experience,
  toAdmin: toAdminExperience,
  toPublic: toExperience,
  publicFilter: { visible: true },
  searchFields: ["role", "company", "description"],
  filters: { visible: bool },
  sortFields: ["order", "startDate", "company", "updatedAt"],
  defaultSort: { order: 1, createdAt: 1 },
  prepare: (input) => ({ logo: input.logo ?? null, endDate: input.current ? "" : input.endDate }),
};
