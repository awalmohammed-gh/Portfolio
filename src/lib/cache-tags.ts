/** Cache tags for public content. Admin writes revalidate the matching tag. */
export const tags = {
  projects: "projects",
  skills: "skills",
  services: "services",
  education: "education",
  experience: "experience",
  content: "content",
  settings: "settings",
} as const;

export type CacheTag = (typeof tags)[keyof typeof tags];
