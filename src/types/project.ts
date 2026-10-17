import type { ImageAsset } from "./media";

export const projectStatuses = ["Live", "Completed", "In Development"] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

/** Soft background tint behind the project screenshot. */
export const projectTints = ["indigo", "emerald", "violet", "blue", "amber", "rose", "cyan"] as const;
export type ProjectTint = (typeof projectTints)[number];

export const publishStatuses = ["draft", "published"] as const;
export type PublishStatus = (typeof publishStatuses)[number];

export interface ProjectRole {
  name: string;
  /** Icon name from lib/icons. */
  icon: string;
  responsibilities: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  /** Short description used on compact cards. */
  summary: string;
  /** Longer description used on featured cards. */
  description: string;
  /** Optional long-form write-up for the project page; paragraphs separated by blank lines. */
  content: string;
  /** Scope areas the system was designed around (not a list of claimed integrations). */
  keyAreas: string[];
  /** User roles, for projects with distinct role-based interfaces. */
  roles: ProjectRole[];
  /** Only list technologies that have been confirmed for this project. */
  technologies: string[];
  status: ProjectStatus;
  /** Icon name from lib/icons, shown when there is no screenshot. */
  icon: string;
  tint: ProjectTint;
  coverImage?: ImageAsset;
  screenshots: ImageAsset[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface AdminProject extends Project {
  publishStatus: PublishStatus;
  order: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
