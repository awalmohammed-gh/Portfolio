import Image from "next/image";
import type { Project } from "@/types/project";

/**
 * Shows the project screenshot when one exists. Otherwise renders a clearly
 * illustrative placeholder (not a fake screenshot) at the same 2:1 ratio (matching desktop screenshots).
 */
export default function ProjectVisual({
  project,
  sizes,
}: {
  project: Project;
  sizes: string;
}) {
  const Icon = project.icon;

  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl bg-navy-900 ring-1 ring-white/10">
      {project.image ? (
        <Image
          src={project.image}
          alt={`Screenshot of ${project.title}`}
          fill
          sizes={sizes}
          className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col" aria-hidden>
          <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-white/5 bg-navy-850 px-3">
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="ml-3 h-3 w-1/3 rounded-full bg-white/5" />
          </div>
          <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950">
            <div className="bg-grid absolute inset-0 opacity-70" />
            <div className="absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />
            <div className="relative grid size-16 place-items-center rounded-2xl bg-navy-950/70 text-accent ring-1 ring-accent/30 transition duration-500 group-hover:scale-110 sm:size-20">
              <Icon className="size-8 sm:size-9" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
