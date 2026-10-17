import { z } from "zod";
import { emailField } from "./auth";
import { httpUrl, iconName, optionalImage, optionalText, requiredText, stringList, text } from "./common";

export const settingsSchema = z.object({
  siteName: requiredText(80, "Site name"),
  jobTitle: optionalText(80),
  siteDescription: optionalText(400),
  seoTitle: optionalText(70),
  seoDescription: optionalText(300),
  keywords: stringList(30, 60),
  /** Public URL of the site, used for canonical links, sitemap and Open Graph. */
  canonicalUrl: z.union([httpUrl, z.literal("")]).optional().default(""),
  logo: optionalImage,
  favicon: optionalImage,
  ogImage: optionalImage,
  email: z.union([z.literal(""), emailField]).optional().default(""),
  phones: z
    .array(
      z.object({
        display: text(40).min(1, "Phone is required"),
        number: z
          .string()
          .trim()
          .regex(/^\+?[0-9]{6,16}$/, "Use digits only, e.g. +233538632229"),
      }),
    )
    .max(4)
    .default([]),
  location: optionalText(120),
  socialLinks: z
    .array(
      z.object({
        label: text(40).min(1, "Label is required"),
        url: httpUrl,
        icon: iconName,
      }),
    )
    .max(12)
    .default([]),
  contactFormEnabled: z.boolean().default(true),
});

export type SiteSettings = z.output<typeof settingsSchema>;
