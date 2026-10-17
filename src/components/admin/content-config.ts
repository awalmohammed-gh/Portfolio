import type { FieldConfig } from "./form/types";

/*
 * Editors for the page-content sections. Field names mirror the Zod schemas
 * in lib/validations/content.ts, which validate every save.
 */

type SectionEditor = { label: string; description: string; page: string; fields: FieldConfig[] };

const heading = (name: string, label: string, help?: string): FieldConfig => ({
  type: "group",
  name,
  label,
  help: help ?? "The highlighted part is shown with the gradient.",
  fields: [
    { type: "text", name: "lead", label: "Text", maxLength: 200, span: "half" },
    { type: "text", name: "highlight", label: "Highlighted text", maxLength: 200, span: "half" },
  ],
});

const link = (name: string, label: string): FieldConfig => ({
  type: "group",
  name,
  label,
  fields: [
    { type: "text", name: "label", label: "Button label", maxLength: 60, span: "half" },
    { type: "text", name: "href", label: "Link", maxLength: 2048, span: "half", placeholder: "/projects or https://…" },
  ],
});

const pageHeader = (help?: string): FieldConfig => ({
  type: "group",
  name: "header",
  label: "Page header",
  help,
  fields: [
    { type: "text", name: "eyebrow", label: "Eyebrow", maxLength: 60 },
    {
      type: "group",
      name: "title",
      label: "Title",
      fields: [
        { type: "text", name: "lead", label: "Text", maxLength: 200, span: "half" },
        { type: "text", name: "highlight", label: "Highlighted text", maxLength: 200, span: "half" },
      ],
    },
    { type: "textarea", name: "description", label: "Description", rows: 3, maxLength: 600 },
  ],
});

const seo: FieldConfig = {
  type: "group",
  name: "seo",
  label: "Search engines",
  help: "Title and description shown in search results and link previews.",
  fields: [
    { type: "text", name: "title", label: "SEO title", maxLength: 70 },
    { type: "textarea", name: "description", label: "SEO description", rows: 2, maxLength: 300 },
  ],
};

const intro = (title = "Section heading"): FieldConfig[] => [
  { type: "section", name: "_intro", label: title },
  { type: "text", name: "eyebrow", label: "Eyebrow", maxLength: 60, span: "half" },
  { type: "text", name: "title", label: "Title", maxLength: 200, span: "half" },
  { type: "textarea", name: "description", label: "Description", rows: 2, maxLength: 600 },
];

export const contentEditors: Record<string, SectionEditor> = {
  hero: {
    label: "Homepage hero",
    page: "/",
    description: "The banner at the top of the homepage: heading, intro, buttons, photo and core stack.",
    fields: [
      { type: "text", name: "badge", label: "Badge", maxLength: 80, help: "Small pill above the heading, e.g. your job title." },
      heading("heading", "Heading"),
      { type: "textarea", name: "intro", label: "Intro", rows: 3, maxLength: 500 },
      { type: "textarea", name: "description", label: "Description (large screens)", rows: 3, maxLength: 1000 },
      link("primaryCta", "Primary button"),
      link("secondaryCta", "Secondary button"),
      { type: "image", name: "image", label: "Hero image", help: "Large background photo. Portrait or wide photos both work." },
      { type: "section", name: "_cards", label: "Info cards" },
      { type: "text", name: "coreStackTitle", label: "Core stack title", maxLength: 60, span: "half" },
      { type: "tags", name: "coreStack", label: "Core stack", suggestionsKey: "skillNames", help: "Pick skills by name; their icons come from Skills." },
      { type: "text", name: "projectsCardLabel", label: "Projects card label", maxLength: 40, span: "half" },
      { type: "text", name: "projectsCardCaption", label: "Projects card caption", maxLength: 60, span: "half" },
    ],
  },
  home: {
    label: "Homepage sections",
    page: "/",
    description: "Headings for the featured projects and services sections on the homepage.",
    fields: [
      {
        type: "group",
        name: "featuredProjects",
        label: "Featured projects",
        fields: [
          { type: "text", name: "eyebrow", label: "Eyebrow", maxLength: 60, span: "half" },
          { type: "text", name: "title", label: "Title", maxLength: 200, span: "half" },
          { type: "textarea", name: "description", label: "Description", rows: 2, maxLength: 600 },
          { type: "text", name: "buttonLabel", label: "Button label", maxLength: 60, help: "{count} becomes the number of published projects." },
        ],
      },
      {
        type: "group",
        name: "servicesPreview",
        label: "Services preview",
        fields: [
          { type: "text", name: "eyebrow", label: "Eyebrow", maxLength: 60, span: "half" },
          { type: "text", name: "title", label: "Title", maxLength: 200, span: "half" },
          { type: "textarea", name: "description", label: "Description", rows: 2, maxLength: 600 },
          { type: "text", name: "buttonLabel", label: "Button label", maxLength: 60 },
        ],
      },
    ],
  },
  about: {
    label: "About page",
    page: "/about",
    description: "Biography, profile photo, quick facts, résumé link and the page header.",
    fields: [
      seo,
      pageHeader(),
      { type: "section", name: "_bio", label: "Biography" },
      { type: "image", name: "photo", label: "Profile picture" },
      { type: "text", name: "photoCaption", label: "Photo caption", maxLength: 60, span: "half" },
      { type: "text", name: "eyebrow", label: "Eyebrow", maxLength: 60, span: "half" },
      heading("title", "Heading"),
      { type: "list", name: "paragraphs", label: "Biography paragraphs", itemLabel: "Paragraph", rows: 4, max: 10 },
      {
        type: "repeater",
        name: "facts",
        label: "Highlights",
        itemLabel: "Highlight",
        titleField: "label",
        max: 6,
        help: "Short facts under the biography. {count} becomes the number of published projects.",
        fields: [
          { type: "icon", name: "icon", label: "Icon", span: "half" },
          { type: "text", name: "label", label: "Label", maxLength: 40, span: "half" },
          { type: "text", name: "value", label: "Value", maxLength: 120 },
        ],
      },
      link("primaryCta", "Primary button"),
      link("secondaryCta", "Secondary button"),
      { type: "url", name: "resumeUrl", label: "Résumé link", span: "half", help: "Link to a PDF (e.g. Google Drive). Adds a download button.", placeholder: "https://…" },
      { type: "text", name: "resumeLabel", label: "Résumé button label", maxLength: 60, span: "half" },
    ],
  },
  skills: {
    label: "Skills section",
    page: "/about",
    description: "Heading above the skills on the About page. Manage the skills themselves under Skills.",
    fields: intro(),
  },
  fullStack: {
    label: "“What I build” section",
    page: "/",
    description: "The frontend / backend / database overview on the homepage and services page.",
    fields: [
      ...intro(),
      {
        type: "repeater",
        name: "layers",
        label: "Layers",
        itemLabel: "Layer",
        titleField: "label",
        max: 6,
        help: "Each layer shows the icon and skills of the chosen skill category.",
        fields: [
          { type: "select", name: "category", label: "Skill category", optionsKey: "categoryTitles", required: true, span: "half" },
          { type: "text", name: "label", label: "Label", maxLength: 40, span: "half" },
          { type: "text", name: "heading", label: "Heading", maxLength: 120 },
          { type: "textarea", name: "text", label: "Text", rows: 2, maxLength: 400 },
        ],
      },
    ],
  },
  education: {
    label: "Education section",
    page: "/about",
    description: "Heading and qualifications note on the About page. Manage entries under Education.",
    fields: [
      ...intro(),
      { type: "text", name: "qualificationsTitle", label: "Qualifications card title", maxLength: 60 },
      { type: "textarea", name: "qualificationsNote", label: "Qualifications note", rows: 2, maxLength: 400 },
    ],
  },
  experience: {
    label: "Experience section",
    page: "/about",
    description: "Heading for work experience on the About page (shown once you add an entry).",
    fields: intro(),
  },
  projects: {
    label: "Projects page",
    page: "/projects",
    description: "Header and closing call to action on the projects page.",
    fields: [
      seo,
      pageHeader("{count} in the description becomes the number of published projects."),
      {
        type: "group",
        name: "cta",
        label: "Call to action",
        help: "Leave empty to use the default call to action.",
        fields: [
          { type: "text", name: "title", label: "Title", maxLength: 200 },
          { type: "textarea", name: "description", label: "Description", rows: 2, maxLength: 500 },
        ],
      },
    ],
  },
  services: {
    label: "Services page",
    page: "/services",
    description: "Header, “how we’ll work” steps and call to action on the services page.",
    fields: [
      seo,
      pageHeader(),
      {
        type: "group",
        name: "process",
        label: "How we’ll work",
        fields: [
          { type: "text", name: "eyebrow", label: "Eyebrow", maxLength: 60, span: "half" },
          { type: "text", name: "title", label: "Title", maxLength: 200, span: "half" },
          { type: "textarea", name: "description", label: "Description", rows: 2, maxLength: 600 },
          {
            type: "repeater",
            name: "steps",
            label: "Steps",
            itemLabel: "Step",
            titleField: "title",
            max: 8,
            fields: [
              { type: "text", name: "title", label: "Title", maxLength: 80 },
              { type: "textarea", name: "text", label: "Text", rows: 2, maxLength: 400 },
            ],
          },
        ],
      },
      {
        type: "group",
        name: "cta",
        label: "Call to action",
        help: "Leave empty to use the default call to action.",
        fields: [
          { type: "text", name: "title", label: "Title", maxLength: 200 },
          { type: "textarea", name: "description", label: "Description", rows: 2, maxLength: 500 },
        ],
      },
    ],
  },
  contact: {
    label: "Contact page",
    page: "/contact",
    description: "Header, note and contact form text. Email and phone numbers are in Site Settings.",
    fields: [
      seo,
      pageHeader(),
      {
        type: "group",
        name: "note",
        label: "Note card",
        fields: [
          { type: "text", name: "title", label: "Title", maxLength: 80 },
          { type: "textarea", name: "text", label: "Text", rows: 3, maxLength: 600 },
        ],
      },
      {
        type: "group",
        name: "form",
        label: "Contact form",
        help: "The form opens the visitor's email app addressed to your email from Site Settings.",
        fields: [
          { type: "text", name: "title", label: "Title", maxLength: 80, span: "half" },
          { type: "text", name: "submitLabel", label: "Submit button", maxLength: 40, span: "half" },
          { type: "text", name: "description", label: "Description", maxLength: 300 },
          { type: "textarea", name: "hint", label: "Hint under the button", rows: 2, maxLength: 300 },
          { type: "textarea", name: "successMessage", label: "Message after submitting", rows: 2, maxLength: 300, help: "{email} becomes your email address." },
        ],
      },
    ],
  },
  cta: {
    label: "Call to action",
    page: "/",
    description: "The default closing banner shown at the bottom of most pages.",
    fields: [
      { type: "text", name: "title", label: "Title", maxLength: 200 },
      { type: "textarea", name: "description", label: "Description", rows: 3, maxLength: 500 },
      { type: "text", name: "primaryLabel", label: "Primary button", maxLength: 60, span: "half" },
      { type: "text", name: "secondaryLabel", label: "Email button", maxLength: 60, span: "half" },
    ],
  },
  footer: {
    label: "Footer",
    page: "/",
    description: "The short description in the site footer.",
    fields: [{ type: "textarea", name: "tagline", label: "Tagline", rows: 3, maxLength: 400 }],
  },
};

export const settingsFields: FieldConfig[] = [
  { type: "section", name: "_identity", label: "Identity" },
  { type: "text", name: "siteName", label: "Site name", required: true, maxLength: 80, span: "half", help: "Your name; used in the logo and page titles." },
  { type: "text", name: "jobTitle", label: "Job title", maxLength: 80, span: "half" },
  { type: "textarea", name: "siteDescription", label: "Site description", rows: 3, maxLength: 400 },
  { type: "image", name: "logo", label: "Logo (optional)", help: "Replaces the name wordmark in the header and footer." },
  { type: "image", name: "favicon", label: "Favicon (optional)", help: "Square image, at least 64×64. Uses the default “MA” icon when empty." },
  { type: "section", name: "_seo", label: "Search engines & sharing" },
  { type: "text", name: "seoTitle", label: "Default SEO title", maxLength: 70, help: "Homepage title in search results. Defaults to “Site name | Job title”." },
  { type: "textarea", name: "seoDescription", label: "Default SEO description", rows: 2, maxLength: 300 },
  { type: "tags", name: "keywords", label: "Keywords" },
  { type: "url", name: "canonicalUrl", label: "Site URL", placeholder: "https://yourname.dev", help: "Your public domain. Enables canonical links and the sitemap." },
  { type: "image", name: "ogImage", label: "Social sharing image", help: "Shown when your site is shared (1200×630 recommended)." },
  { type: "section", name: "_contact", label: "Contact details" },
  { type: "email", name: "email", label: "Email", span: "half" },
  { type: "text", name: "location", label: "Location", maxLength: 120, span: "half" },
  {
    type: "repeater",
    name: "phones",
    label: "Phone numbers",
    itemLabel: "Phone",
    titleField: "display",
    max: 4,
    fields: [
      { type: "text", name: "display", label: "As shown", maxLength: 40, span: "half", placeholder: "053 863 2229" },
      { type: "text", name: "number", label: "International number", maxLength: 17, span: "half", placeholder: "+233538632229" },
    ],
  },
  {
    type: "repeater",
    name: "socialLinks",
    label: "Social media links",
    itemLabel: "Link",
    titleField: "label",
    max: 12,
    fields: [
      { type: "text", name: "label", label: "Label", maxLength: 40, span: "half", placeholder: "GitHub" },
      { type: "icon", name: "icon", label: "Icon", span: "half" },
      { type: "url", name: "url", label: "URL", placeholder: "https://github.com/…" },
    ],
  },
  { type: "switch", name: "contactFormEnabled", label: "Contact form", description: "Show the message form on the contact page." },
];
