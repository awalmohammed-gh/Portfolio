import type { IconType } from "react-icons";

export interface Skill {
  name: string;
  icon: IconType;
}

export interface SkillGroup {
  title: string;
  description: string;
  icon: IconType;
  skills: Skill[];
}

export interface Service {
  title: string;
  description: string;
  icon: IconType;
  includes: string[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconType;
}
