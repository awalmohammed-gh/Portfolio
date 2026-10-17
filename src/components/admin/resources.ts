import { projectStatuses, projectTints } from "@/types/project";
import type { FieldConfig, FormValues, Option } from "./form/types";

/*
 * Admin definitions for each content collection: form fields, list columns,
 * defaults and endpoints. Plain data, so server pages can pass a resource key
 * and client components look the rest up here.
 */

export type Column = {
  key: string;
  label: string;
  kind: "title" | "text" | "badge" | "date" | "count";
  /** Badge tone per value. */
  tones?: Record<string, "success" | "warning" | "default" | "accent">;
  /** Display labels per value. */
  labels?: Record<string, string>;
};

export type Toggle = {
  key: string;
  on: unknown;
  off: unknown;
  onLabel: string;
  offLabel: string;
  /** Verb shown on the button for switching to "on" / "off". */
  turnOn: string;
  turnOff: string;
};

export type ResourceConfig = {
  key: ResourceKey;
  singular: string;
  plural: string;
  description: string;
  apiPath: string;
  adminPath: string;
  titleKey: string;
  subtitleKey?: string;
  imageKey?: string;
  iconKey?: string;
  searchKeys: string[];
  filters?: { key: string; label: string; options?: Option[]; optionsKey?: string }[];
  columns: Column[];
  toggle?: Toggle;
  fields: FieldConfig[];
  defaults: FormValues;
  /** Extra submit buttons for the editor (e.g. save draft vs publish). */
  variants?: { label: string; patch?: FormValues; primary?: boolean }[];
  previewable?: boolean;
};

export type ResourceKey = "projects" | "skills" | "skill-categories" | "services" | "education" | "experience";

const projectFields: FieldConfig[] = [
  { type: "section", name: "_basics", label: "Basics" },
  { type: "text", name: "title", label: "Project title", required: true, maxLength: 140 },
  { type: "text", name: "category", label: "Category", required: true, maxLength: 80, span: "half", placeholder: "Full-Stack E-commerce" },
  { type: "select", name: "status", label: "Project status", required: true, span: "half", options: projectStatuses.map((s) => ({ value: s, label: s })) },
  {
    type: "text",
    name: "slug",
    label: "URL slug",
    maxLength: 120,
    span: "half",
    help: "Used in /projects/your-slug. Leave empty to generate it from the title.",
    placeholder: "greenfarm",
  },
  { type: "switch", name: "featured", label: "Featured", span: "half", description: "Show on the homepage." },
  { type: "textarea", name: "summary", label: "Short description", required: true, rows: 2, maxLength: 400, help: "Shown on compact project cards." },
  { type: "textarea", name: "description", label: "Description", required: true, rows: 4, maxLength: 2000, help: "Shown on the projects page and at the top of the project page." },
  {
    type: "textarea",
    name: "content",
    label: "Detailed write-up",
    rows: 8,
    maxLength: 20000,
    help: "Optional long-form content for the project page. Separate paragraphs with a blank line.",
  },
  { type: "section", name: "_scope", label: "Scope & technology" },
  { type: "tags", name: "technologies", label: "Technologies used", suggestionsKey: "skillNames", help: "Only list technologies confirmed for this project." },
  { type: "list", name: "keyAreas", label: "Key areas", itemLabel: "Key area", max: 20 },
  {
    type: "repeater",
    name: "roles",
    label: "User roles",
    itemLabel: "Role",
    titleField: "name",
    max: 8,
    help: "For systems with distinct interfaces per role (e.g. Admin, Customer).",
    fields: [
      { type: "text", name: "name", label: "Role name", required: true, span: "half", maxLength: 60 },
      { type: "icon", name: "icon", label: "Icon", span: "half" },
      { type: "list", name: "responsibilities", label: "Responsibilities", itemLabel: "Responsibility", max: 12 },
    ],
  },
  { type: "section", name: "_media", label: "Images" },
  { type: "image", name: "coverImage", label: "Cover image", help: "The main screenshot on cards. Wide images (2:1) work best." },
  { type: "gallery", name: "screenshots", label: "Additional screenshots", max: 20, help: "Shown on the project page." },
  { type: "icon", name: "icon", label: "Fallback icon", span: "half", help: "Shown when there's no cover image." },
  {
    type: "select",
    name: "tint",
    label: "Card tint",
    span: "half",
    required: true,
    options: projectTints.map((t) => ({ value: t, label: t[0].toUpperCase() + t.slice(1) })),
  },
  { type: "section", name: "_links", label: "Links" },
  { type: "url", name: "liveUrl", label: "Live website URL", span: "half", placeholder: "https://…" },
  { type: "url", name: "githubUrl", label: "GitHub repository URL", span: "half", placeholder: "https://github.com/…" },
];

export const resources: Record<ResourceKey, ResourceConfig> = {
  projects: {
    key: "projects",
    singular: "Project",
    plural: "Projects",
    description: "Case studies shown on the homepage and projects page. Drafts stay private until published.",
    apiPath: "/api/projects",
    adminPath: "/admin/projects",
    titleKey: "title",
    subtitleKey: "category",
    imageKey: "coverImage",
    iconKey: "icon",
    searchKeys: ["title", "category", "summary", "technologies"],
    filters: [
      { key: "publishStatus", label: "Status", options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }] },
      { key: "featured", label: "Featured", options: [{ value: "true", label: "Featured" }, { value: "false", label: "Not featured" }] },
    ],
    columns: [
      { key: "publishStatus", label: "Status", kind: "badge", tones: { published: "success", draft: "warning" }, labels: { published: "Published", draft: "Draft" } },
      { key: "featured", label: "Featured", kind: "badge", tones: { true: "accent" }, labels: { true: "Featured", false: "" } },
      { key: "status", label: "Project status", kind: "text" },
      { key: "updatedAt", label: "Updated", kind: "date" },
    ],
    toggle: { key: "publishStatus", on: "published", off: "draft", onLabel: "Published", offLabel: "Draft", turnOn: "Publish", turnOff: "Unpublish" },
    fields: projectFields,
    defaults: {
      title: "",
      slug: "",
      category: "",
      summary: "",
      description: "",
      content: "",
      keyAreas: [],
      roles: [],
      technologies: [],
      status: "Completed",
      icon: "FaCode",
      tint: "indigo",
      coverImage: null,
      screenshots: [],
      liveUrl: "",
      githubUrl: "",
      featured: false,
      publishStatus: "draft",
    },
    variants: [
      { label: "Save draft", patch: { publishStatus: "draft" } },
      { label: "Save & publish", patch: { publishStatus: "published" }, primary: true },
    ],
    previewable: true,
  },

  "skill-categories": {
    key: "skill-categories",
    singular: "Skill category",
    plural: "Skill categories",
    description: "Groups like Frontend, Backend and Database. Their order is the order on the About page.",
    apiPath: "/api/skill-categories",
    adminPath: "/admin/skills/categories",
    titleKey: "title",
    subtitleKey: "description",
    iconKey: "icon",
    searchKeys: ["title", "description"],
    columns: [{ key: "updatedAt", label: "Updated", kind: "date" }],
    fields: [
      { type: "text", name: "title", label: "Title", required: true, maxLength: 80, span: "half" },
      { type: "icon", name: "icon", label: "Icon", span: "half" },
      { type: "textarea", name: "description", label: "Description", rows: 2, maxLength: 300 },
    ],
    defaults: { title: "", description: "", icon: "FaCode" },
  },

  skills: {
    key: "skills",
    singular: "Skill",
    plural: "Skills",
    description: "Technologies shown in the skills section, hero, marquee and “What I build”.",
    apiPath: "/api/skills",
    adminPath: "/admin/skills",
    titleKey: "name",
    subtitleKey: "categoryId",
    imageKey: "iconImage",
    iconKey: "icon",
    searchKeys: ["name"],
    filters: [{ key: "categoryId", label: "Category", optionsKey: "categories" }],
    columns: [
      { key: "categoryId", label: "Category", kind: "text" },
      { key: "visible", label: "Visibility", kind: "badge", tones: { true: "success", false: "default" }, labels: { true: "Visible", false: "Hidden" } },
    ],
    toggle: { key: "visible", on: true, off: false, onLabel: "Visible", offLabel: "Hidden", turnOn: "Show", turnOff: "Hide" },
    fields: [
      { type: "text", name: "name", label: "Name", required: true, maxLength: 60, span: "half" },
      { type: "select", name: "categoryId", label: "Category", required: true, optionsKey: "categories", span: "half" },
      { type: "icon", name: "icon", label: "Icon", span: "half" },
      { type: "switch", name: "visible", label: "Visible", span: "half", description: "Show this skill on the site." },
      { type: "image", name: "iconImage", label: "Custom logo (optional)", help: "Upload a logo to use instead of the icon. Square images work best." },
    ],
    defaults: { name: "", categoryId: "", icon: "FaCode", iconImage: null, visible: true },
  },

  services: {
    key: "services",
    singular: "Service",
    plural: "Services",
    description: "Services listed on the homepage, services page and contact form.",
    apiPath: "/api/services",
    adminPath: "/admin/services",
    titleKey: "title",
    subtitleKey: "description",
    iconKey: "icon",
    searchKeys: ["title", "description"],
    columns: [
      { key: "visible", label: "Visibility", kind: "badge", tones: { true: "success", false: "default" }, labels: { true: "Visible", false: "Hidden" } },
      { key: "updatedAt", label: "Updated", kind: "date" },
    ],
    toggle: { key: "visible", on: true, off: false, onLabel: "Visible", offLabel: "Hidden", turnOn: "Show", turnOff: "Hide" },
    fields: [
      { type: "text", name: "title", label: "Title", required: true, maxLength: 100, span: "half" },
      { type: "icon", name: "icon", label: "Icon", span: "half" },
      { type: "textarea", name: "description", label: "Description", required: true, rows: 3, maxLength: 600 },
      { type: "list", name: "includes", label: "What's included", itemLabel: "Item", max: 10 },
      { type: "switch", name: "visible", label: "Visible", description: "Show this service on the site." },
    ],
    defaults: { title: "", description: "", icon: "FaCode", includes: [], visible: true },
  },

  education: {
    key: "education",
    singular: "Education entry",
    plural: "Education",
    description: "Schools and qualifications, most recent first. The first entry also appears in the homepage hero.",
    apiPath: "/api/education",
    adminPath: "/admin/education",
    titleKey: "institution",
    subtitleKey: "qualification.title",
    iconKey: "icon",
    searchKeys: ["institution", "level", "qualification.title"],
    columns: [
      { key: "qualification.status", label: "Status", kind: "badge", tones: { completed: "success", "graduation-pending": "warning", "in-progress": "warning" }, labels: { completed: "Completed", "graduation-pending": "Graduation pending", "in-progress": "In progress" } },
      { key: "visible", label: "Visibility", kind: "badge", tones: { true: "success", false: "default" }, labels: { true: "Visible", false: "Hidden" } },
    ],
    toggle: { key: "visible", on: true, off: false, onLabel: "Visible", offLabel: "Hidden", turnOn: "Show", turnOff: "Hide" },
    fields: [
      { type: "section", name: "_institution", label: "Institution" },
      { type: "text", name: "institution", label: "Institution", required: true, maxLength: 160 },
      { type: "text", name: "institutionShort", label: "Short name", maxLength: 30, span: "half", placeholder: "AIT" },
      { type: "text", name: "level", label: "Level", required: true, maxLength: 60, span: "half", placeholder: "University" },
      { type: "icon", name: "icon", label: "Icon", span: "half" },
      { type: "text", name: "course", label: "Course / programme", maxLength: 160, span: "half" },
      { type: "section", name: "_qualification", label: "Qualification & dates" },
      {
        type: "group",
        name: "qualification",
        label: "Qualification",
        fields: [
          { type: "text", name: "title", label: "Qualification", required: true, maxLength: 160 },
          { type: "text", name: "shortTitle", label: "Abbreviation", required: true, maxLength: 30, span: "half", placeholder: "BIT" },
          {
            type: "select",
            name: "status",
            label: "Status",
            required: true,
            span: "half",
            options: [
              { value: "completed", label: "Completed" },
              { value: "graduation-pending", label: "Graduation pending" },
              { value: "in-progress", label: "In progress" },
            ],
          },
          { type: "text", name: "statusLabel", label: "Status label", required: true, maxLength: 120, help: "Shown on the site, e.g. “Completed 2017”. Only claim awards that are confirmed." },
        ],
      },
      { type: "text", name: "startDate", label: "Start (YYYY or YYYY-MM)", maxLength: 7, span: "half", placeholder: "2021" },
      { type: "number", name: "completionYear", label: "Completion year", min: 1950, max: 2100, span: "half", help: "Leave empty unless confirmed." },
      { type: "textarea", name: "note", label: "Description", rows: 3, maxLength: 1000 },
      { type: "section", name: "_certificate", label: "Certificate & visibility" },
      { type: "image", name: "certificate", label: "Certificate (optional)", help: "Adds a “View certificate” link." },
      { type: "switch", name: "visible", label: "Visible", description: "Show this entry on the site." },
    ],
    defaults: {
      level: "",
      icon: "LuGraduationCap",
      institution: "",
      institutionShort: "",
      qualification: { title: "", shortTitle: "", status: "completed", statusLabel: "" },
      course: "",
      startDate: "",
      completionYear: null,
      note: "",
      certificate: null,
      visible: true,
    },
  },

  experience: {
    key: "experience",
    singular: "Experience entry",
    plural: "Experience",
    description: "Work history on the About page. The section stays hidden until you add an entry.",
    apiPath: "/api/experience",
    adminPath: "/admin/experience",
    titleKey: "role",
    subtitleKey: "company",
    imageKey: "logo",
    searchKeys: ["role", "company", "description"],
    columns: [
      { key: "current", label: "Current", kind: "badge", tones: { true: "accent" }, labels: { true: "Current role", false: "" } },
      { key: "visible", label: "Visibility", kind: "badge", tones: { true: "success", false: "default" }, labels: { true: "Visible", false: "Hidden" } },
    ],
    toggle: { key: "visible", on: true, off: false, onLabel: "Visible", offLabel: "Hidden", turnOn: "Show", turnOff: "Hide" },
    fields: [
      { type: "section", name: "_employment", label: "Employment details" },
      { type: "text", name: "role", label: "Role / job title", required: true, maxLength: 120, span: "half" },
      { type: "text", name: "company", label: "Company", required: true, maxLength: 120, span: "half" },
      { type: "url", name: "companyUrl", label: "Company website", span: "half", placeholder: "https://…" },
      { type: "text", name: "location", label: "Location", maxLength: 120, span: "half", placeholder: "Accra, Ghana · Remote" },
      { type: "text", name: "employmentType", label: "Employment type", maxLength: 60, span: "half", placeholder: "Full-time, Contract, Freelance…" },
      { type: "switch", name: "current", label: "Current role", span: "half", description: "I work here now." },
      { type: "section", name: "_dates", label: "Dates" },
      { type: "text", name: "startDate", label: "Start (YYYY-MM)", required: true, maxLength: 7, span: "half", placeholder: "2024-01" },
      { type: "text", name: "endDate", label: "End (YYYY-MM)", maxLength: 7, span: "half", placeholder: "2025-06", help: "Leave empty for a current role." },
      { type: "section", name: "_highlights", label: "Highlights & technology" },
      { type: "textarea", name: "description", label: "Summary", rows: 3, maxLength: 2000 },
      { type: "list", name: "highlights", label: "Highlights", itemLabel: "Highlight", rows: 2, max: 12 },
      { type: "tags", name: "technologies", label: "Technologies", suggestionsKey: "skillNames" },
      { type: "section", name: "_appearance", label: "Appearance & visibility" },
      { type: "image", name: "logo", label: "Company logo (optional)" },
      { type: "switch", name: "visible", label: "Visible", description: "Show this entry on the site." },
    ],
    defaults: {
      role: "",
      company: "",
      companyUrl: "",
      location: "",
      employmentType: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      highlights: [],
      technologies: [],
      logo: null,
      visible: true,
    },
  },
};
