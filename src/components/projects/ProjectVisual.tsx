import Image from "next/image";
import type { Project } from "@/types/project";

// Soft per-project tint behind the screenshot; works in light and dark themes.
const tints: Record<string, string> = {
  greenfarm: "from-emerald-500/25 via-emerald-500/5",
  "real-estate": "from-violet-500/25 via-violet-500/5",
  "employee-management": "from-blue-500/25 via-blue-500/5",
  "car-rental": "from-amber-500/25 via-amber-500/5",
  "village-store": "from-rose-500/25 via-rose-500/5",
  "learning-management-system": "from-cyan-500/25 via-cyan-500/5",
};

/**
 * A tinted panel with the screenshot rising from the bottom edge. Projects
 * without a screenshot get an icon tile at the same size instead.
 */
export default function ProjectVisual({
  project,
  sizes,
}: {
  project: Project;
  sizes: string;
}) {
  const Icon = project.icon;
  const tint = tints[project.slug] ?? "from-indigo-500/25 via-indigo-500/5";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br ${tint} to-transparent bg-surface-2 px-5 pt-5 sm:px-7 sm:pt-7`}
    >
      <div
        className="bg-dots pointer-events-none absolute inset-0 [mask-image:none] opacity-60"
        aria-hidden="true"
      />
      <div className="relative overflow-hidden rounded-t-xl border border-b-0 border-line bg-surface shadow-card transition duration-500 group-hover:-translate-y-1.5">
        <div className="flex h-6 items-center gap-1.5 border-b border-line px-3" aria-hidden="true">
          <span className="size-2 rounded-full bg-[#ff5f57]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="relative aspect-2/1">
          {project.image ? (
            <Image
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              fill
              sizes={sizes}
              className="object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-surface-2" aria-hidden="true">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="grid size-14 place-items-center rounded-2xl bg-surface text-accent shadow-card">
                  <Icon className="size-6" />
                </span>
                <span className="px-4 text-sm font-medium text-muted">{project.title}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
