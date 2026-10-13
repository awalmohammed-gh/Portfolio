import { LuLayers } from "react-icons/lu";
import Tag from "@/components/ui/Tag";
import type { Project, ProjectStatus } from "@/types/project";

const statusTone: Record<ProjectStatus, "success" | "warning" | "default"> = {
  Live: "success",
  "In Development": "warning",
  Completed: "default",
};

export function FullStackTag() {
  return (
    <Tag tone="accent">
      <LuLayers aria-hidden="true" className="size-3.5" />
      Full-Stack
    </Tag>
  );
}

export function StatusTag({ status }: { status: ProjectStatus }) {
  return (
    <Tag tone={statusTone[status]}>
      <span
        className={`size-1.5 rounded-full bg-current ${status === "Live" ? "animate-pulse" : ""}`}
        aria-hidden="true"
      />
      <span className="sr-only">Status: </span>
      {status}
    </Tag>
  );
}

export function TechList({ technologies }: { technologies: Project["technologies"] }) {
  if (technologies.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
      {technologies.map((tech) => (
        <li
          key={tech}
          className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}
