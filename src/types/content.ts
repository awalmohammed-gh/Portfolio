import type { ImageAsset } from "./media";

export interface Skill {
  id: string;
  name: string;
  /** Icon name from lib/icons. */
  icon: string;
  /** Optional uploaded logo, shown instead of the icon. */
  iconImage?: ImageAsset;
}

export interface SkillGroup {
  id: string;
  title: string;
  description: string;
  icon: string;
  skills: Skill[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  includes: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location?: string;
  employmentType?: string;
  /** "YYYY-MM" */
  startDate: string;
  /** "YYYY-MM"; empty when current. */
  endDate?: string;
  current: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
  logo?: ImageAsset;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  url: string;
  /** Icon name from lib/icons. */
  icon: string;
}

export interface PhoneNumber {
  /** As shown, e.g. "053 863 2229". */
  display: string;
  /** International format used for dialling, e.g. "+233538632229". */
  number: string;
}
