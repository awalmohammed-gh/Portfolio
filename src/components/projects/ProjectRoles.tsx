import { FaCheck } from "react-icons/fa6";
import type { ProjectRole } from "@/types/project";

export default function ProjectRoles({ roles }: { roles: ProjectRole[] }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wider text-ink-subtle uppercase">
        {roles.length} user roles
      </p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-3">
        {roles.map(({ name, icon: Icon, responsibilities }) => (
          <li key={name} className="rounded-xl bg-navy-950/60 p-4 ring-1 ring-white/5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="grid size-7 place-items-center rounded-md bg-accent/10 text-accent">
                <Icon aria-hidden className="size-3.5" />
              </span>
              {name}
            </p>
            <ul className="mt-3 space-y-2">
              {responsibilities.map((item) => (
                <li key={item} className="flex gap-2 text-xs leading-relaxed text-ink-muted">
                  <FaCheck aria-hidden className="mt-0.5 size-3 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
