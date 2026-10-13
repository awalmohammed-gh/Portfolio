import { LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import { FaGithub } from "react-icons/fa6";
import ButtonLink from "@/components/ui/ButtonLink";
import type { Project } from "@/types/project";

/** Renders only the links that exist, with a working contact fallback. */
export default function ProjectLinks({
  project,
  size = "sm",
}: {
  project: Project;
  size?: "sm" | "md";
}) {
  const { liveUrl, githubUrl, title } = project;

  if (!liveUrl && !githubUrl) {
    return (
      <ButtonLink href="/contact" variant="ghost">
        Ask about this project
        <LuArrowRight
          aria-hidden="true"
          className="size-4 transition group-hover/button:translate-x-0.5"
        />
      </ButtonLink>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {liveUrl && (
        <ButtonLink href={liveUrl} external size={size}>
          Live Demo
          <LuArrowUpRight aria-hidden="true" className="size-4" />
          <span className="sr-only">: {title}</span>
        </ButtonLink>
      )}
      {githubUrl && (
        <ButtonLink href={githubUrl} external size={size} variant="secondary">
          <FaGithub aria-hidden="true" className="size-4" />
          GitHub
          <span className="sr-only">: {title}</span>
        </ButtonLink>
      )}
    </div>
  );
}
