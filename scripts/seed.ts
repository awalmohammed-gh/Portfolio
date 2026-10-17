/*
 * Migrates the portfolio's original content into MongoDB.
 *
 *   npm run db:seed
 *
 * Safe to run repeatedly: every record is matched on a natural key and only
 * inserted when missing ($setOnInsert). Existing records, including anything
 * edited in the admin dashboard, are never modified or deleted.
 */
import { connectToDatabase, disconnectFromDatabase } from "@/lib/db";
import { contentSchemas, contentSections } from "@/lib/validations/content";
import { settingsSchema } from "@/lib/validations/settings";
import { educationSchema, projectSchema, serviceSchema, skillCategorySchema } from "@/lib/validations/resources";
import { EducationModel } from "@/models/Education";
import { ProjectModel } from "@/models/Project";
import { ServiceModel } from "@/models/Service";
import { SiteContentModel } from "@/models/SiteContent";
import { SiteSettingsModel } from "@/models/SiteSettings";
import { SkillCategoryModel, SkillModel } from "@/models/Skill";
import { loadEnv } from "./load-env";
import * as seed from "./seed-data";

type Counts = { inserted: number; existing: number };
const report: Record<string, Counts> = {};

function tally(name: string, upserted: boolean) {
  report[name] ??= { inserted: 0, existing: 0 };
  report[name][upserted ? "inserted" : "existing"]++;
}

/** Inserts the document only if no document matches the filter. */
async function insertIfMissing(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: { updateOne: (...args: any[]) => Promise<{ upsertedCount?: number }> },
  name: string,
  filter: Record<string, unknown>,
  fields: Record<string, unknown>,
) {
  const now = new Date();
  const result = await model.updateOne(
    filter,
    { $setOnInsert: { ...fields, createdAt: now, updatedAt: now } },
    { upsert: true, timestamps: false },
  );
  tally(name, (result.upsertedCount ?? 0) > 0);
}

async function main() {
  loadEnv();
  await connectToDatabase();
  console.log("Connected. Migrating original portfolio content…\n");

  // Make sure unique indexes exist before upserting.
  await Promise.all(
    [ProjectModel, SkillCategoryModel, SkillModel, ServiceModel, EducationModel, SiteContentModel, SiteSettingsModel].map(
      (model) => model.createIndexes(),
    ),
  );

  // Site settings (singleton)
  const settings = settingsSchema.parse(seed.settings);
  await insertIfMissing(SiteSettingsModel, "settings", { key: "site" }, { key: "site", ...settings });

  // Projects, in their original display order
  for (const [order, project] of seed.projects.entries()) {
    const input = projectSchema.parse({ ...project, publishStatus: "published" });
    await insertIfMissing(ProjectModel, "projects", { slug: input.slug }, {
      ...input,
      coverImage: input.coverImage ?? null,
      publishedAt: new Date(),
      order,
    });
  }

  // Skill categories and skills
  for (const [categoryOrder, group] of seed.skillGroups.entries()) {
    const category = skillCategorySchema.parse(group);
    await insertIfMissing(SkillCategoryModel, "skill categories", { title: category.title }, {
      ...category,
      order: categoryOrder,
    });
    const stored = await SkillCategoryModel.findOne({ title: category.title }).lean();
    for (const [order, skill] of group.skills.entries()) {
      await insertIfMissing(SkillModel, "skills", { categoryId: stored!._id, name: skill.name }, {
        name: skill.name,
        icon: skill.icon,
        iconImage: null,
        categoryId: stored!._id,
        visible: true,
        order,
      });
    }
  }

  // Services
  for (const [order, service] of seed.services.entries()) {
    const input = serviceSchema.parse(service);
    await insertIfMissing(ServiceModel, "services", { title: input.title }, { ...input, order });
  }

  // Education
  for (const [order, entry] of seed.education.entries()) {
    const input = educationSchema.parse(entry);
    await insertIfMissing(
      EducationModel,
      "education",
      { institution: input.institution, "qualification.title": input.qualification.title },
      { ...input, certificate: null, completionYear: input.completionYear ?? null, order },
    );
  }

  // Page content sections
  for (const section of contentSections) {
    const raw = (seed.content as Record<string, unknown>)[section];
    if (!raw) continue;
    const data = contentSchemas[section].parse(raw);
    await insertIfMissing(SiteContentModel, "content sections", { section }, { section, data });
  }

  console.table(report);
  console.log("\nDone. Existing records were left untouched.");
}

main()
  .catch((error) => {
    console.error("\nMigration failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => disconnectFromDatabase());
