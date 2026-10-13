import { FaDatabase, FaLaptopCode, FaServer, FaToolbox } from "react-icons/fa6";
import {
  SiCss,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMongoose,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { TbApi, TbShieldLock } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";
import type { SkillGroup } from "@/types/content";

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend Development",
    description: "Responsive, accessible interfaces that feel fast and intuitive.",
    icon: FaLaptopCode,
    skills: [
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss },
      { name: "JavaScript", icon: SiJavascript },
      { name: "TypeScript", icon: SiTypescript },
      { name: "React.js", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Tailwind CSS", icon: SiTailwindcss },
    ],
  },
  {
    title: "Backend Development",
    description: "Server-side logic, APIs, and secure access control.",
    icon: FaServer,
    skills: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express.js", icon: SiExpress },
      { name: "REST APIs", icon: TbApi },
      { name: "Authentication & Authorization", icon: TbShieldLock },
    ],
  },
  {
    title: "Database",
    description: "Structured data models that keep applications reliable.",
    icon: FaDatabase,
    skills: [
      { name: "MongoDB", icon: SiMongodb },
      { name: "Mongoose", icon: SiMongoose },
    ],
  },
  {
    title: "Development Tools",
    description: "Version control, editing, and deployment workflow.",
    icon: FaToolbox,
    skills: [
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
      { name: "VS Code", icon: VscVscode },
      { name: "Vercel", icon: SiVercel },
    ],
  },
];
