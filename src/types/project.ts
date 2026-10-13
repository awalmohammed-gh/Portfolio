import type { IconType } from "react-icons";

export type ProjectStatus = "Completed" | "In Development" | "Live";

export interface ProjectRole {
  name: string;
  icon: IconType;
  responsibilities: string[];
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  /** Short description used on compact cards. */
  summary: string;
  /** Longer description used on featured cards. */
  description: string;
  /** Scope areas the system was designed around (not a list of claimed integrations). */
  keyAreas: string[];
  /** User roles, for projects with distinct role-based interfaces. */
  roles?: ProjectRole[];
  /** Only list technologies that have been confirmed for this project. */
  technologies: string[];
  status: ProjectStatus;
  icon: IconType;
  /** Path under /public, e.g. "/images/projects/greenfarm.png". Omit until a real screenshot exists. */
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}
