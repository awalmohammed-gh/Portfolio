import { z } from "zod";
import { isIconName } from "@/lib/icons";

/** Trimmed plain text with a length cap. Content is always rendered as text, never as HTML. */
export const text = (max: number) => z.string().trim().max(max, `Must be ${max} characters or fewer`);
export const requiredText = (max: number, label = "This field") =>
  text(max).min(1, `${label} is required`);

export const optionalText = (max: number) => text(max).optional().default("");

/** Absolute http(s) URL. Blocks javascript:, data: and other schemes. */
export const httpUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }, "Enter a full URL starting with https://");

export const optionalHttpUrl = z.union([httpUrl, z.literal("")]).optional().default("");

/**
 * Link target for buttons: a site path ("/projects", "/about#education"),
 * an in-page anchor, an http(s) URL, or a mailto:/tel: link.
 */
export const linkHref = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => {
    if (/^\/(?!\/)/.test(value) || value.startsWith("#")) return true;
    if (/^(mailto|tel):[^\s]+$/i.test(value)) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }, "Use a site path like /projects, a full https:// URL, or a mailto:/tel: link");

export const iconName = z
  .string()
  .trim()
  .refine(isIconName, "Choose an icon from the list");

/** List of short strings. Blank rows (e.g. an added-but-unfilled item) are dropped, not rejected. */
export const stringList = (maxItems: number, maxLength: number) =>
  z
    .array(text(maxLength))
    .transform((items) => items.filter(Boolean))
    .pipe(z.array(z.string()).max(maxItems))
    .default([]);

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

/** Image reference: a Cloudinary upload or a static file under /public. */
export const imageAsset = z.object({
  url: z
    .string()
    .trim()
    .max(2048)
    .refine(
      (value) => value.startsWith("/") || /^https:\/\/res\.cloudinary\.com\//.test(value),
      "Images must be uploaded to the media library",
    ),
  publicId: text(300).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: text(300).optional().default(""),
});

export const optionalImage = imageAsset.nullable().optional();

export const reorderSchema = z.object({
  ids: z.array(objectId).min(1).max(500),
});

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens");

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
