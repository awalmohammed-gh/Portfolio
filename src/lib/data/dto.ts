import type { Types } from "mongoose";
import type { EducationDoc } from "@/models/Education";
import type { ExperienceDoc } from "@/models/Experience";
import type { MediaAssetDoc } from "@/models/MediaAsset";
import type { ProjectDoc } from "@/models/Project";
import type { ServiceDoc } from "@/models/Service";
import type { SkillCategoryDoc, SkillDoc } from "@/models/Skill";
import type { SiteSettingsDoc } from "@/models/SiteSettings";
import type { Experience, Service, Skill } from "@/types/content";
import type { EducationEntry } from "@/types/education";
import type { ImageAsset, MediaAssetRecord } from "@/types/media";
import type { AdminProject, Project } from "@/types/project";
import { settingsSchema, type SiteSettings } from "@/lib/validations/settings";

/*
 * Converts lean Mongoose documents into plain, serializable objects. Only the
 * fields listed here ever leave the server, and ObjectIds/Dates become strings
 * so results can be cached with `use cache` and passed to Client Components.
 */

export type Lean<T> = T & { _id: Types.ObjectId; createdAt?: Date; updatedAt?: Date };

type StoredImage = {
  url?: string | null;
  publicId?: string | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
} | null | undefined;

export function toImage(image: StoredImage): ImageAsset | undefined {
  if (!image?.url) return undefined;
  return {
    url: image.url,
    ...(image.publicId ? { publicId: image.publicId } : {}),
    ...(image.width ? { width: image.width } : {}),
    ...(image.height ? { height: image.height } : {}),
    alt: image.alt ?? "",
  };
}

const iso = (date: Date | null | undefined) => (date ? new Date(date).toISOString() : "");

export function toProject(doc: Lean<ProjectDoc>): Project {
  return {
    id: String(doc._id),
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    summary: doc.summary,
    description: doc.description,
    content: doc.content ?? "",
    keyAreas: [...(doc.keyAreas ?? [])],
    roles: (doc.roles ?? []).map((role) => ({
      name: role.name,
      icon: role.icon ?? "FaUser",
      responsibilities: [...(role.responsibilities ?? [])],
    })),
    technologies: [...(doc.technologies ?? [])],
    status: doc.status ?? "Completed",
    icon: doc.icon ?? "FaCode",
    tint: doc.tint ?? "indigo",
    coverImage: toImage(doc.coverImage),
    screenshots: (doc.screenshots ?? []).map(toImage).filter((image) => image !== undefined),
    liveUrl: doc.liveUrl || undefined,
    githubUrl: doc.githubUrl || undefined,
    featured: Boolean(doc.featured),
  };
}

export function toAdminProject(doc: Lean<ProjectDoc>): AdminProject {
  return {
    ...toProject(doc),
    publishStatus: doc.publishStatus ?? "draft",
    order: doc.order ?? 0,
    publishedAt: doc.publishedAt ? iso(doc.publishedAt) : undefined,
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  };
}

export function toSkill(doc: Lean<SkillDoc>): Skill {
  return {
    id: String(doc._id),
    name: doc.name,
    icon: doc.icon ?? "FaCode",
    iconImage: toImage(doc.iconImage),
  };
}

export type AdminSkill = Skill & {
  categoryId: string;
  visible: boolean;
  order: number;
  updatedAt: string;
};

export function toAdminSkill(doc: Lean<SkillDoc>): AdminSkill {
  return {
    ...toSkill(doc),
    categoryId: String(doc.categoryId),
    visible: doc.visible !== false,
    order: doc.order ?? 0,
    updatedAt: iso(doc.updatedAt),
  };
}

export type AdminSkillCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  updatedAt: string;
};

export function toSkillCategory(doc: Lean<SkillCategoryDoc>): AdminSkillCategory {
  return {
    id: String(doc._id),
    title: doc.title,
    description: doc.description ?? "",
    icon: doc.icon ?? "FaCode",
    order: doc.order ?? 0,
    updatedAt: iso(doc.updatedAt),
  };
}

export function toService(doc: Lean<ServiceDoc>): Service {
  return {
    id: String(doc._id),
    title: doc.title,
    description: doc.description,
    icon: doc.icon ?? "FaCode",
    includes: [...(doc.includes ?? [])],
  };
}

export type AdminService = Service & { visible: boolean; order: number; updatedAt: string };

export function toAdminService(doc: Lean<ServiceDoc>): AdminService {
  return {
    ...toService(doc),
    visible: doc.visible !== false,
    order: doc.order ?? 0,
    updatedAt: iso(doc.updatedAt),
  };
}

export function toEducation(doc: Lean<EducationDoc>): EducationEntry {
  return {
    id: String(doc._id),
    level: doc.level,
    icon: doc.icon ?? "LuGraduationCap",
    institution: doc.institution,
    institutionShort: doc.institutionShort || undefined,
    qualification: {
      title: doc.qualification?.title ?? "",
      shortTitle: doc.qualification?.shortTitle ?? "",
      status: doc.qualification?.status ?? "completed",
      statusLabel: doc.qualification?.statusLabel ?? "",
    },
    course: doc.course || undefined,
    startDate: doc.startDate || undefined,
    completionYear: doc.completionYear ?? undefined,
    note: doc.note || undefined,
    certificate: toImage(doc.certificate),
  };
}

export type AdminEducation = EducationEntry & { visible: boolean; order: number; updatedAt: string };

export function toAdminEducation(doc: Lean<EducationDoc>): AdminEducation {
  return {
    ...toEducation(doc),
    visible: doc.visible !== false,
    order: doc.order ?? 0,
    updatedAt: iso(doc.updatedAt),
  };
}

export function toExperience(doc: Lean<ExperienceDoc>): Experience {
  return {
    id: String(doc._id),
    role: doc.role,
    company: doc.company,
    companyUrl: doc.companyUrl || undefined,
    location: doc.location || undefined,
    employmentType: doc.employmentType || undefined,
    startDate: doc.startDate,
    endDate: doc.endDate || undefined,
    current: Boolean(doc.current),
    description: doc.description ?? "",
    highlights: [...(doc.highlights ?? [])],
    technologies: [...(doc.technologies ?? [])],
    logo: toImage(doc.logo),
  };
}

export type AdminExperience = Experience & { visible: boolean; order: number; updatedAt: string };

export function toAdminExperience(doc: Lean<ExperienceDoc>): AdminExperience {
  return {
    ...toExperience(doc),
    visible: doc.visible !== false,
    order: doc.order ?? 0,
    updatedAt: iso(doc.updatedAt),
  };
}

export function toMediaAsset(doc: Lean<MediaAssetDoc>): MediaAssetRecord {
  return {
    id: String(doc._id),
    publicId: doc.publicId,
    url: doc.url,
    width: doc.width ?? undefined,
    height: doc.height ?? undefined,
    format: doc.format ?? undefined,
    bytes: doc.bytes ?? undefined,
    alt: doc.alt ?? "",
    originalFilename: doc.originalFilename || undefined,
    createdAt: iso(doc.createdAt),
  };
}

export type SettingsWithMeta = SiteSettings & { updatedAt: string };

/** Settings always parse through the schema so missing fields get defaults. */
export function toSettings(doc: Lean<SiteSettingsDoc> | null): SettingsWithMeta {
  const raw = doc
    ? {
        ...doc,
        logo: toImage(doc.logo) ?? null,
        favicon: toImage(doc.favicon) ?? null,
        ogImage: toImage(doc.ogImage) ?? null,
      }
    : { siteName: "Portfolio" };
  const parsed = settingsSchema.safeParse(raw);
  const settings = parsed.success ? parsed.data : settingsSchema.parse({ siteName: doc?.siteName || "Portfolio" });
  return { ...settings, updatedAt: iso(doc?.updatedAt) };
}
