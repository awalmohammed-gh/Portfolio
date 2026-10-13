import { FaLayerGroup } from "react-icons/fa6";
import Tag from "@/components/ui/Tag";
import type { Project, ProjectStatus } from "@/types/project";

const statusTone: Record<ProjectStatus, "success" | "warning" | "accent"> = {
  Completed: "success",
  "In Development": "warning",
  Live: "accent",
};

export function FullStackTag() {
  return (
    <Tag tone="accent">
      <FaLayerGroup aria-hidden className="size-3" />
      Full-Stack
    </Tag>
  );
}

export function StatusTag({ status }: { status: ProjectStatus }) {
  return (
    <Tag tone={statusTone[status]}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      <span className="sr-only">Status: </span>
      {status}
    </Tag>
  );
}

export function TechList({ technologies }: { technologies: Project["technologies"] }) {
  if (technologies.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies used">
      {technologies.map((tech) => (
        <li key={tech} className="rounded-md bg-navy-800 px-2 py-1 font-mono text-[11px] text-ink-muted">
          {tech}
        </li>
      ))}
    </ul>
  );
}
