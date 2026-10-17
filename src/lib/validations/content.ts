import { z } from "zod";
import {
  iconName,
  linkHref,
  optionalHttpUrl,
  optionalImage,
  optionalText,
  stringList,
  text,
} from "./common";

/*
 * Each editable section of the public site has a controlled schema. Parsing
 * fills defaults, so a section saved before a field existed still renders.
 * Text is always rendered as plain text, never as HTML.
 */

const heading = z
  .object({ lead: optionalText(200), highlight: optionalText(200) })
  .default({ lead: "", highlight: "" });

const link = z.object({ label: text(60), href: z.union([linkHref, z.literal("")]) }).default({ label: "", href: "" });

const pageHeader = z
  .object({ eyebrow: optionalText(60), title: heading, description: optionalText(600) })
  .default({ eyebrow: "", title: { lead: "", highlight: "" }, description: "" });

const sectionIntro = {
  eyebrow: optionalText(60),
  title: optionalText(200),
  description: optionalText(600),
};

const seo = z
  .object({ title: optionalText(70), description: optionalText(300) })
  .default({ title: "", description: "" });

const cta = z
  .object({ title: optionalText(200), description: optionalText(500) })
  .default({ title: "", description: "" });

export const contentSchemas = {
  hero: z.object({
    badge: optionalText(80),
    heading,
    intro: optionalText(500),
    description: optionalText(1000),
    primaryCta: link,
    secondaryCta: link,
    image: optionalImage,
    coreStackTitle: optionalText(60),
    /** Skill names shown in the hero; icons come from the matching skills. */
    coreStack: stringList(16, 60),
    projectsCardLabel: optionalText(40),
    projectsCardCaption: optionalText(60),
  }),

  home: z.object({
    featuredProjects: z
      .object({ ...sectionIntro, buttonLabel: optionalText(60) })
      .default({ eyebrow: "", title: "", description: "", buttonLabel: "" }),
    servicesPreview: z
      .object({ ...sectionIntro, buttonLabel: optionalText(60) })
      .default({ eyebrow: "", title: "", description: "", buttonLabel: "" }),
  }),

  about: z.object({
    seo,
    header: pageHeader,
    photo: optionalImage,
    photoCaption: optionalText(60),
    eyebrow: optionalText(60),
    title: heading,
    paragraphs: z.array(text(2000)).max(10).default([]),
    facts: z
      .array(z.object({ icon: iconName, label: text(40), value: text(120) }))
      .max(6)
      .default([]),
    primaryCta: link,
    secondaryCta: link,
    resumeUrl: optionalHttpUrl,
    resumeLabel: optionalText(60),
  }),

  skills: z.object(sectionIntro),

  fullStack: z.object({
    ...sectionIntro,
    layers: z
      .array(
        z.object({
          /** Title of the skill category whose icon and skills this layer shows. */
          category: text(80),
          label: text(40),
          heading: text(120),
          text: text(400),
        }),
      )
      .max(6)
      .default([]),
  }),

  education: z.object({
    ...sectionIntro,
    qualificationsTitle: optionalText(60),
    qualificationsNote: optionalText(400),
  }),

  experience: z.object(sectionIntro),

  projects: z.object({
    seo,
    header: pageHeader,
    cta,
  }),

  services: z.object({
    seo,
    header: pageHeader,
    process: z
      .object({
        ...sectionIntro,
        steps: z.array(z.object({ title: text(80), text: text(400) })).max(8).default([]),
      })
      .default({ eyebrow: "", title: "", description: "", steps: [] }),
    cta,
  }),

  contact: z.object({
    seo,
    header: pageHeader,
    note: z
      .object({ title: optionalText(80), text: optionalText(600) })
      .default({ title: "", text: "" }),
    form: z
      .object({
        title: optionalText(80),
        description: optionalText(300),
        submitLabel: optionalText(40),
        hint: optionalText(300),
        successMessage: optionalText(300),
      })
      .default({ title: "", description: "", submitLabel: "", hint: "", successMessage: "" }),
  }),

  cta: z.object({
    title: optionalText(200),
    description: optionalText(500),
    primaryLabel: optionalText(60),
    secondaryLabel: optionalText(60),
  }),

  footer: z.object({
    tagline: optionalText(400),
  }),
} as const;

export type ContentSection = keyof typeof contentSchemas;
export const contentSections = Object.keys(contentSchemas) as ContentSection[];

export type SectionContent<S extends ContentSection> = z.output<(typeof contentSchemas)[S]>;
export type SiteContentMap = { [S in ContentSection]: SectionContent<S> };

export function isContentSection(value: string): value is ContentSection {
  return Object.hasOwn(contentSchemas, value);
}

/** Parses stored data, falling back to an all-defaults section if it no longer validates. */
export function parseSection<S extends ContentSection>(section: S, data: unknown): SectionContent<S> {
  const schema = contentSchemas[section];
  const parsed = schema.safeParse(data ?? {});
  if (parsed.success) return parsed.data as SectionContent<S>;
  console.error(`Stored content for "${section}" is invalid`, parsed.error.issues);
  return schema.parse({}) as SectionContent<S>;
}
