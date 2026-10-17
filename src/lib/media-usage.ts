import "server-only";
import { destroyImage } from "@/lib/cloudinary";
import { EducationModel } from "@/models/Education";
import { ExperienceModel } from "@/models/Experience";
import { MediaAssetModel } from "@/models/MediaAsset";
import { ProjectModel } from "@/models/Project";
import { SiteContentModel } from "@/models/SiteContent";
import { SiteSettingsModel } from "@/models/SiteSettings";
import { SkillModel } from "@/models/Skill";

type Img = { publicId?: string | null } | null | undefined;

/** Every Cloudinary publicId referenced by content, mapped to where it's used. */
export async function collectMediaReferences(): Promise<Map<string, string[]>> {
  const refs = new Map<string, string[]>();
  const add = (image: Img, label: string) => {
    if (!image?.publicId) return;
    const list = refs.get(image.publicId) ?? [];
    list.push(label);
    refs.set(image.publicId, list);
  };

  const [projects, skills, education, experience, settings, content] = await Promise.all([
    ProjectModel.find({}, { title: 1, coverImage: 1, screenshots: 1 }).lean(),
    SkillModel.find({ "iconImage.publicId": { $exists: true } }, { name: 1, iconImage: 1 }).lean(),
    EducationModel.find({ "certificate.publicId": { $exists: true } }, { institution: 1, certificate: 1 }).lean(),
    ExperienceModel.find({ "logo.publicId": { $exists: true } }, { company: 1, logo: 1 }).lean(),
    SiteSettingsModel.findOne({ key: "site" }, { logo: 1, favicon: 1, ogImage: 1 }).lean(),
    SiteContentModel.find({}, { section: 1, data: 1 }).lean(),
  ]);

  for (const project of projects) {
    add(project.coverImage, `Project “${project.title}” (cover)`);
    for (const shot of project.screenshots ?? []) add(shot, `Project “${project.title}” (screenshot)`);
  }
  for (const skill of skills) add(skill.iconImage, `Skill “${skill.name}”`);
  for (const entry of education) add(entry.certificate, `Education “${entry.institution}”`);
  for (const entry of experience) add(entry.logo, `Experience “${entry.company}”`);
  if (settings) {
    add(settings.logo, "Site settings (logo)");
    add(settings.favicon, "Site settings (favicon)");
    add(settings.ogImage, "Site settings (Open Graph image)");
  }
  // Section content is free-form JSON validated by Zod; walk it for image objects.
  for (const doc of content) {
    walk(doc.data, (image) => add(image, `Page content “${doc.section}”`));
  }
  return refs;
}

function walk(value: unknown, visit: (image: Img) => void) {
  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, visit));
  } else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.publicId === "string" && typeof record.url === "string") visit(record as Img);
    Object.values(record).forEach((item) => walk(item, visit));
  }
}

/** Collects publicIds from any image-bearing value (record, array, nested object). */
export function publicIdsIn(value: unknown): string[] {
  const ids: string[] = [];
  walk(value, (image) => image?.publicId && ids.push(image.publicId));
  return ids;
}

/**
 * After a record changes or is deleted, removes images that were uploaded to
 * the media library and are no longer referenced anywhere. Failures are logged
 * and left for manual cleanup in the media library; they never fail the save.
 */
export async function cleanupOrphanedMedia(candidates: string[]): Promise<void> {
  const unique = [...new Set(candidates)];
  if (unique.length === 0) return;

  try {
    const refs = await collectMediaReferences();
    const orphaned = unique.filter((id) => !refs.has(id));
    if (orphaned.length === 0) return;

    const assets = await MediaAssetModel.find({ publicId: { $in: orphaned } }, { publicId: 1 }).lean();
    for (const asset of assets) {
      try {
        await destroyImage(asset.publicId);
        await MediaAssetModel.deleteOne({ _id: asset._id });
      } catch (error) {
        console.error(`[media] could not remove orphaned image ${asset.publicId}`, error);
      }
    }
  } catch (error) {
    console.error("[media] orphan cleanup failed", error);
  }
}
