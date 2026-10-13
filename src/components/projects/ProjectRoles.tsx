import { LuCheck } from "react-icons/lu";
import type { ProjectRole } from "@/types/project";

export default function ProjectRoles({ roles }: { roles: ProjectRole[] }) {
  return (
    <div>
      <p className="font-mono text-xs font-medium tracking-[0.14em] text-subtle uppercase">
        {roles.length} user roles
      </p>
      <ul className={`mt-3 grid gap-3 ${roles.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {roles.map(({ name, icon: Icon, responsibilities }) => (
          <li key={name} className="rounded-2xl border border-line bg-surface-2 p-4">
            <p className="flex items-center gap-2.5 font-semibold text-fg">
              <span className="grid size-8 place-items-center rounded-lg bg-accent-soft text-accent">
                <Icon aria-hidden="true" className="size-3.5" />
              </span>
              {name}
            </p>
            <ul className="mt-3 space-y-2">
              {responsibilities.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6 text-muted">
                  <LuCheck aria-hidden="true" className="mt-1 size-3.5 shrink-0 text-accent" />
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
