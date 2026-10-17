import "server-only";
import { requireAdmin } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db";
import { collectMediaReferences } from "@/lib/media-usage";
import { contentSections, parseSection, type ContentSection } from "@/lib/validations/content";
import { SessionModel } from "@/models/Auth";
import { EducationModel, type EducationDoc } from "@/models/Education";
import { ExperienceModel, type ExperienceDoc } from "@/models/Experience";
import { MediaAssetModel, type MediaAssetDoc } from "@/models/MediaAsset";
import { ProjectModel, type ProjectDoc } from "@/models/Project";
import { ServiceModel, type ServiceDoc } from "@/models/Service";
import { SiteContentModel } from "@/models/SiteContent";
import { SiteSettingsModel, type SiteSettingsDoc } from "@/models/SiteSettings";
import { SkillCategoryModel, SkillModel, type SkillCategoryDoc, type SkillDoc } from "@/models/Skill";
import {
  toAdminEducation,
  toAdminExperience,
  toAdminProject,
  toAdminService,
  toAdminSkill,
  toMediaAsset,
  toSettings,
  toSkillCategory,
  type Lean,
} from "./dto";

/*
 * Uncached reads for the admin dashboard. Every function verifies the admin
 * session itself, so a page can't accidentally expose drafts or private data.
 */

async function ready() {
  await requireAdmin();
  await connectToDatabase();
}

const byOrder = { order: 1, createdAt: 1 } as const;

export async function listProjects() {
  await ready();
  return (await ProjectModel.find().sort(byOrder).lean<Lean<ProjectDoc>[]>()).map(toAdminProject);
}

export async function getProject(id: string) {
  await ready();
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  const doc = await ProjectModel.findById(id).lean<Lean<ProjectDoc>>();
  return doc ? toAdminProject(doc) : null;
}

export async function listSkillCategories() {
  await ready();
  return (await SkillCategoryModel.find().sort(byOrder).lean<Lean<SkillCategoryDoc>[]>()).map(toSkillCategory);
}

export async function listSkills() {
  await ready();
  return (await SkillModel.find().sort(byOrder).lean<Lean<SkillDoc>[]>()).map(toAdminSkill);
}

export async function listServices() {
  await ready();
  return (await ServiceModel.find().sort(byOrder).lean<Lean<ServiceDoc>[]>()).map(toAdminService);
}

export async function listEducation() {
  await ready();
  return (await EducationModel.find().sort(byOrder).lean<Lean<EducationDoc>[]>()).map(toAdminEducation);
}

export async function listExperience() {
  await ready();
  return (await ExperienceModel.find().sort(byOrder).lean<Lean<ExperienceDoc>[]>()).map(toAdminExperience);
}

/** Generic single-record lookup for the edit pages. */
export async function getRecord(kind: "skills" | "skill-categories" | "services" | "education" | "experience", id: string) {
  await ready();
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  switch (kind) {
    case "skills": {
      const doc = await SkillModel.findById(id).lean<Lean<SkillDoc>>();
      return doc ? toAdminSkill(doc) : null;
    }
    case "skill-categories": {
      const doc = await SkillCategoryModel.findById(id).lean<Lean<SkillCategoryDoc>>();
      return doc ? toSkillCategory(doc) : null;
    }
    case "services": {
      const doc = await ServiceModel.findById(id).lean<Lean<ServiceDoc>>();
      return doc ? toAdminService(doc) : null;
    }
    case "education": {
      const doc = await EducationModel.findById(id).lean<Lean<EducationDoc>>();
      return doc ? toAdminEducation(doc) : null;
    }
    case "experience": {
      const doc = await ExperienceModel.findById(id).lean<Lean<ExperienceDoc>>();
      return doc ? toAdminExperience(doc) : null;
    }
  }
}

export async function getSectionContent(section: ContentSection) {
  await ready();
  const doc = await SiteContentModel.findOne({ section }).lean();
  return {
    data: parseSection(section, doc?.data),
    updatedAt: doc?.updatedAt ? new Date(doc.updatedAt).toISOString() : "",
  };
}

export async function listContentSections() {
  await ready();
  const docs = await SiteContentModel.find({ section: { $in: contentSections } }, { section: 1, updatedAt: 1 }).lean();
  const updated = new Map(docs.map((doc) => [doc.section, doc.updatedAt ? new Date(doc.updatedAt).toISOString() : ""]));
  return contentSections.map((section) => ({ section, updatedAt: updated.get(section) ?? "" }));
}

export async function getSettingsForAdmin() {
  await ready();
  return toSettings(await SiteSettingsModel.findOne({ key: "site" }).lean<Lean<SiteSettingsDoc>>());
}

export async function listMedia() {
  await ready();
  const [docs, refs] = await Promise.all([
    MediaAssetModel.find().sort({ createdAt: -1 }).limit(24).lean<Lean<MediaAssetDoc>[]>(),
    collectMediaReferences(),
  ]);
  return docs.map((doc) => ({ ...toMediaAsset(doc), usageCount: refs.get(doc.publicId)?.length ?? 0 }));
}

export async function listSessions() {
  const admin = await requireAdmin();
  await connectToDatabase();
  const sessions = await SessionModel.find({ adminId: admin.id, expiresAt: { $gt: new Date() } })
    .sort({ lastUsedAt: -1 })
    .lean();
  return sessions.map((session) => ({
    id: String(session._id),
    current: String(session._id) === admin.sessionId,
    userAgent: session.userAgent ?? "",
    ip: session.ip ?? "",
    createdAt: session.createdAt ? new Date(session.createdAt).toISOString() : "",
    lastUsedAt: session.lastUsedAt ? new Date(session.lastUsedAt).toISOString() : "",
  }));
}

type Activity = { kind: string; title: string; href: string; updatedAt: string };

/** Real counts from the database for the dashboard overview. */
export async function getDashboardStats() {
  await ready();

  const [
    totalProjects,
    publishedProjects,
    featuredProjects,
    totalSkills,
    totalCategories,
    totalServices,
    visibleServices,
    totalEducation,
    totalExperience,
    totalMedia,
    recentProjects,
    recentServices,
    recentSkills,
    recentEducation,
    recentExperience,
    recentContent,
    settings,
  ] = await Promise.all([
    ProjectModel.countDocuments(),
    ProjectModel.countDocuments({ publishStatus: "published" }),
    ProjectModel.countDocuments({ publishStatus: "published", featured: true }),
    SkillModel.countDocuments(),
    SkillCategoryModel.countDocuments(),
    ServiceModel.countDocuments(),
    ServiceModel.countDocuments({ visible: true }),
    EducationModel.countDocuments(),
    ExperienceModel.countDocuments(),
    MediaAssetModel.countDocuments(),
    ProjectModel.find({}, { title: 1, updatedAt: 1 }).sort({ updatedAt: -1 }).limit(5).lean(),
    ServiceModel.find({}, { title: 1, updatedAt: 1 }).sort({ updatedAt: -1 }).limit(3).lean(),
    SkillModel.find({}, { name: 1, updatedAt: 1 }).sort({ updatedAt: -1 }).limit(3).lean(),
    EducationModel.find({}, { institution: 1, updatedAt: 1 }).sort({ updatedAt: -1 }).limit(2).lean(),
    ExperienceModel.find({}, { company: 1, updatedAt: 1 }).sort({ updatedAt: -1 }).limit(2).lean(),
    SiteContentModel.find({}, { section: 1, updatedAt: 1 }).sort({ updatedAt: -1 }).limit(4).lean(),
    SiteSettingsModel.findOne({ key: "site" }, { updatedAt: 1 }).lean(),
  ]);

  const iso = (d?: Date | null) => (d ? new Date(d).toISOString() : "");
  const activity: Activity[] = [
    ...recentProjects.map((d) => ({ kind: "Project", title: d.title, href: `/admin/projects/${d._id}`, updatedAt: iso(d.updatedAt) })),
    ...recentServices.map((d) => ({ kind: "Service", title: d.title, href: `/admin/services/${d._id}`, updatedAt: iso(d.updatedAt) })),
    ...recentSkills.map((d) => ({ kind: "Skill", title: d.name, href: `/admin/skills/${d._id}`, updatedAt: iso(d.updatedAt) })),
    ...recentEducation.map((d) => ({ kind: "Education", title: d.institution, href: `/admin/education/${d._id}`, updatedAt: iso(d.updatedAt) })),
    ...recentExperience.map((d) => ({ kind: "Experience", title: d.company, href: `/admin/experience/${d._id}`, updatedAt: iso(d.updatedAt) })),
    ...recentContent.map((d) => ({ kind: "Page content", title: d.section, href: `/admin/content/${d.section}`, updatedAt: iso(d.updatedAt) })),
    ...(settings ? [{ kind: "Settings", title: "Site settings", href: "/admin/settings", updatedAt: iso(settings.updatedAt) }] : []),
  ]
    .filter((item) => item.updatedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return {
    totalProjects,
    publishedProjects,
    draftProjects: totalProjects - publishedProjects,
    featuredProjects,
    totalSkills,
    totalCategories,
    totalServices,
    visibleServices,
    totalEducation,
    totalExperience,
    totalMedia,
    lastUpdate: activity[0]?.updatedAt ?? "",
    activity: activity.slice(0, 8),
  };
}
