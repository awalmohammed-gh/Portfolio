import { z } from "zod";
import { projectStatuses, projectTints, publishStatuses } from "@/types/project";
import { qualificationStatuses } from "@/types/education";
import {
  iconName,
  imageAsset,
  objectId,
  optionalHttpUrl,
  optionalImage,
  optionalText,
  requiredText,
  slugSchema,
  stringList,
  text,
} from "./common";

const yearMonth = z
  .string()
  .trim()
  .regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, "Use YYYY or YYYY-MM");

/* ------------------------------- Projects -------------------------------- */

export const projectRoleSchema = z.object({
  name: requiredText(60, "Role name"),
  icon: iconName.default("FaUser"),
  responsibilities: stringList(12, 200),
});

export const projectSchema = z.object({
  title: requiredText(140, "Title"),
  slug: z.union([slugSchema, z.literal("")]).optional().default(""),
  category: requiredText(80, "Category"),
  summary: requiredText(400, "Short description"),
  description: requiredText(2000, "Description"),
  content: optionalText(20000),
  keyAreas: stringList(20, 120),
  roles: z.array(projectRoleSchema).max(8).default([]),
  technologies: stringList(30, 60),
  status: z.enum(projectStatuses).default("Completed"),
  icon: iconName.default("FaCode"),
  tint: z.enum(projectTints).default("indigo"),
  coverImage: optionalImage,
  screenshots: z.array(imageAsset).max(20).default([]),
  liveUrl: optionalHttpUrl,
  githubUrl: optionalHttpUrl,
  featured: z.boolean().default(false),
  publishStatus: z.enum(publishStatuses).default("draft"),
});

/* -------------------------------- Skills --------------------------------- */

export const skillCategorySchema = z.object({
  title: requiredText(80, "Title"),
  description: optionalText(300),
  icon: iconName.default("FaCode"),
});

export const skillSchema = z.object({
  name: requiredText(60, "Name"),
  icon: iconName.default("FaCode"),
  iconImage: optionalImage,
  categoryId: objectId,
  visible: z.boolean().default(true),
});

/* ------------------------------- Services -------------------------------- */

export const serviceSchema = z.object({
  title: requiredText(100, "Title"),
  description: requiredText(600, "Description"),
  icon: iconName.default("FaCode"),
  includes: stringList(10, 120),
  visible: z.boolean().default(true),
});

/* ------------------------------- Education ------------------------------- */

export const educationSchema = z.object({
  level: requiredText(60, "Level"),
  icon: iconName.default("LuGraduationCap"),
  institution: requiredText(160, "Institution"),
  institutionShort: optionalText(30),
  qualification: z.object({
    title: requiredText(160, "Qualification"),
    shortTitle: requiredText(30, "Short title"),
    status: z.enum(qualificationStatuses).default("completed"),
    statusLabel: requiredText(120, "Status label"),
  }),
  course: optionalText(160),
  startDate: z.union([yearMonth, z.literal("")]).optional().default(""),
  completionYear: z
    .number()
    .int()
    .min(1950)
    .max(2100)
    .nullable()
    .optional(),
  note: optionalText(1000),
  certificate: optionalImage,
  visible: z.boolean().default(true),
});

/* ------------------------------ Experience ------------------------------- */

export const experienceSchema = z
  .object({
    role: requiredText(120, "Role"),
    company: requiredText(120, "Company"),
    companyUrl: optionalHttpUrl,
    location: optionalText(120),
    employmentType: optionalText(60),
    startDate: yearMonth,
    endDate: z.union([yearMonth, z.literal("")]).optional().default(""),
    current: z.boolean().default(false),
    description: optionalText(2000),
    highlights: stringList(12, 300),
    technologies: stringList(30, 60),
    logo: optionalImage,
    visible: z.boolean().default(true),
  })
  .refine((value) => value.current || value.endDate, {
    message: "Add an end date or mark this role as current",
    path: ["endDate"],
  });

/* -------------------------------- Media ---------------------------------- */

export const mediaUpdateSchema = z.object({
  alt: text(300),
});
