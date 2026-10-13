import { FaArrowRight, FaArrowUpRightFromSquare, FaGithub } from "react-icons/fa6";
import ButtonLink from "@/components/ui/ButtonLink";
import type { Project } from "@/types/project";

/** Only renders buttons for links that exist; falls back to a working contact link. */
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
      <ButtonLink href="/contact" variant="ghost" size={size} className="group/link">
        Ask about this project
        <FaArrowRight
          aria-hidden
          className="size-3 transition group-hover/link:translate-x-0.5"
        />
      </ButtonLink>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {liveUrl && (
        <ButtonLink href={liveUrl} external size={size}>
          <FaArrowUpRightFromSquare aria-hidden className="size-3" />
          Live Demo<span className="sr-only"> of {title}</span>
        </ButtonLink>
      )}
      {githubUrl && (
        <ButtonLink href={githubUrl} external variant="secondary" size={size}>
          <FaGithub aria-hidden className="size-3.5" />
          GitHub<span className="sr-only"> repository for {title}</span>
        </ButtonLink>
      )}
    </div>
  );
}
