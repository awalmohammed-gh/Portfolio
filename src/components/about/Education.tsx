import { FaCircleCheck, FaGraduationCap, FaHourglassHalf, FaSchool } from "react-icons/fa6";
import Tag from "@/components/ui/Tag";
import { education } from "@/data/education";

/** Vertical education timeline, most recent first. */
export default function Education() {
  return (
    <ol className="relative space-y-6 border-l border-white/10 pl-8 sm:pl-10">
      {education.map((entry) => {
        const LevelIcon = entry.level === "University" ? FaGraduationCap : FaSchool;
        const completed = entry.qualification.status === "completed";

        return (
          <li key={entry.id} className="reveal relative">
            <span
              className="absolute top-5 -left-[3.125rem] grid size-9 place-items-center rounded-full bg-navy-950 text-accent ring-2 ring-accent/40 sm:-left-[3.625rem]"
              aria-hidden
            >
              <LevelIcon className="size-4" />
            </span>

            <article className="rounded-2xl bg-navy-900/70 p-5 ring-1 ring-white/5 transition hover:ring-accent/30 sm:p-6">
              <p className="font-mono text-xs tracking-wider text-accent uppercase">{entry.level}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink sm:text-xl">
                {entry.institution}
                {entry.institutionShort && (
                  <span className="text-ink-subtle"> ({entry.institutionShort})</span>
                )}
              </h3>
              <p className="mt-1 text-ink-muted">
                {entry.qualification.title}
                {entry.qualification.shortTitle !== entry.qualification.title && (
                  <span className="text-ink-subtle"> · {entry.qualification.shortTitle}</span>
                )}
              </p>

              <div className="mt-4">
                <Tag tone={completed ? "success" : "warning"}>
                  {completed ? (
                    <FaCircleCheck aria-hidden className="size-3" />
                  ) : (
                    <FaHourglassHalf aria-hidden className="size-3" />
                  )}
                  {entry.qualification.statusLabel}
                </Tag>
              </div>

              {entry.note && <p className="mt-4 text-sm text-ink-subtle">{entry.note}</p>}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
