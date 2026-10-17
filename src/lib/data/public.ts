import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { tags } from "@/lib/cache-tags";
import {
  contentSchemas,
  contentSections,
  parseSection,
  type ContentSection,
  type SectionContent,
  type SiteContentMap,
} from "@/lib/validations/content";
import { EducationModel, type EducationDoc } from "@/models/Education";
import { ExperienceModel, type ExperienceDoc } from "@/models/Experience";
import { ProjectModel, type ProjectDoc } from "@/models/Project";
import { ServiceModel, type ServiceDoc } from "@/models/Service";
import { SiteContentModel } from "@/models/SiteContent";
import { SiteSettingsModel, type SiteSettingsDoc } from "@/models/SiteSettings";
import {
  SkillCategoryModel,
  SkillModel,
  type SkillCategoryDoc,
  type SkillDoc,
} from "@/models/Skill";
import type { Experience, Service, SkillGroup } from "@/types/content";
import type { EducationEntry } from "@/types/education";
import type { Project } from "@/types/project";
import {
  toEducation,
  toExperience,
  toProject,
  toService,
  toSettings,
  toSkill,
  type Lean,
  type SettingsWithMeta,
} from "./dto";

/*
 * Read-only queries for the public site. Each is cached and tagged; admin
 * writes call revalidateTag() so pages pick up changes without a redeploy.
 * Only published / visible records are returned.
 */

export async function getPublishedProjects(): Promise<Project[]> {
  "use cache";
  cacheTag(tags.projects);
  cacheLife("max");

  await connectToDatabase();
  const docs = await ProjectModel.find({ publishStatus: "published" })
    .sort({ order: 1, createdAt: 1 })
    .lean<Lean<ProjectDoc>[]>();
  return docs.map(toProject);
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  "use cache";
  cacheTag(tags.projects);
  cacheLife("max");

  await connectToDatabase();
  const doc = await ProjectModel.findOne({ slug, publishStatus: "published" }).lean<Lean<ProjectDoc>>();
  return doc ? toProject(doc) : null;
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  "use cache";
  cacheTag(tags.skills);
  cacheLife("max");

  await connectToDatabase();
  const [categories, skills] = await Promise.all([
    SkillCategoryModel.find().sort({ order: 1, createdAt: 1 }).lean<Lean<SkillCategoryDoc>[]>(),
    SkillModel.find({ visible: true }).sort({ order: 1, createdAt: 1 }).lean<Lean<SkillDoc>[]>(),
  ]);

  return categories.map((category) => ({
    id: String(category._id),
    title: category.title,
    description: category.description ?? "",
    icon: category.icon ?? "FaCode",
    skills: skills
      .filter((skill) => String(skill.categoryId) === String(category._id))
      .map(toSkill),
  }));
}

export async function getServices(): Promise<Service[]> {
  "use cache";
  cacheTag(tags.services);
  cacheLife("max");

  await connectToDatabase();
  const docs = await ServiceModel.find({ visible: true })
    .sort({ order: 1, createdAt: 1 })
    .lean<Lean<ServiceDoc>[]>();
  return docs.map(toService);
}

/** Ordered most recent first (by display order). */
export async function getEducation(): Promise<EducationEntry[]> {
  "use cache";
  cacheTag(tags.education);
  cacheLife("max");

  await connectToDatabase();
  const docs = await EducationModel.find({ visible: true })
    .sort({ order: 1, createdAt: 1 })
    .lean<Lean<EducationDoc>[]>();
  return docs.map(toEducation);
}

export async function getExperience(): Promise<Experience[]> {
  "use cache";
  cacheTag(tags.experience);
  cacheLife("max");

  await connectToDatabase();
  const docs = await ExperienceModel.find({ visible: true })
    .sort({ order: 1, createdAt: 1 })
    .lean<Lean<ExperienceDoc>[]>();
  return docs.map(toExperience);
}

export async function getSiteSettings(): Promise<SettingsWithMeta> {
  "use cache";
  cacheTag(tags.settings);
  cacheLife("max");

  await connectToDatabase();
  const doc = await SiteSettingsModel.findOne({ key: "site" }).lean<Lean<SiteSettingsDoc>>();
  return toSettings(doc);
}

export async function getAllContent(): Promise<SiteContentMap> {
  "use cache";
  cacheTag(tags.content);
  cacheLife("max");

  await connectToDatabase();
  const docs = await SiteContentModel.find({ section: { $in: contentSections } })
    .select({ section: 1, data: 1 })
    .lean<{ section: string; data: unknown }[]>();
  const stored = new Map(docs.map((doc) => [doc.section, doc.data]));

  return Object.fromEntries(
    contentSections.map((section) => [section, parseSection(section, stored.get(section))]),
  ) as SiteContentMap;
}

export async function getContent<S extends ContentSection>(section: S): Promise<SectionContent<S>> {
  const all = await getAllContent();
  return all[section] ?? (contentSchemas[section].parse({}) as SectionContent<S>);
}
