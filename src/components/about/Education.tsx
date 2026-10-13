import { LuCircleCheck, LuGraduationCap, LuHourglass, LuSchool } from "react-icons/lu";
import Tag from "@/components/ui/Tag";
import { education } from "@/data/education";

/** Vertical education timeline, most recent first. */
export default function Education() {
  return (
    <ol className="relative space-y-5 before:absolute before:top-6 before:bottom-6 before:left-6 before:w-px before:bg-line">
      {education.map((entry) => {
        const LevelIcon = entry.level === "University" ? LuGraduationCap : LuSchool;
        const completed = entry.qualification.status === "completed";

        return (
          <li key={entry.id} className="reveal relative flex gap-5">
            <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-surface text-accent shadow-card">
              <LevelIcon aria-hidden="true" className="size-5" />
            </span>

            <article className="flex-1 rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-7">
              <p className="font-mono text-xs font-medium tracking-[0.14em] text-accent uppercase">
                {entry.level}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-fg">
                {entry.institution}
                {entry.institutionShort && (
                  <span className="font-normal text-muted"> ({entry.institutionShort})</span>
                )}
              </h3>
              <p className="mt-1.5 text-base text-muted">
                {entry.qualification.title} ({entry.qualification.shortTitle})
              </p>

              <Tag tone={completed ? "success" : "warning"} className="mt-4">
                {completed ? (
                  <LuCircleCheck aria-hidden="true" className="size-3.5" />
                ) : (
                  <LuHourglass aria-hidden="true" className="size-3.5" />
                )}
                {entry.qualification.statusLabel}
              </Tag>

              {entry.note && (
                <p className="mt-4 text-[0.95rem] leading-7 text-muted">{entry.note}</p>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
