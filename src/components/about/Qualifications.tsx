import { LuAward } from "react-icons/lu";
import type { EducationEntry } from "@/types/education";

const statusText = {
  completed: "Completed",
  "graduation-pending": "Graduation pending",
  "in-progress": "In progress",
} as const;

/** Compact qualifications summary, derived from the education data. */
export default function Qualifications({
  education,
  title,
  note,
}: {
  education: EducationEntry[];
  title: string;
  note: string;
}) {
  return (
    <aside
      aria-labelledby="qualifications-heading"
      className="reveal relative overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-8"
    >
      <div
        className="pointer-events-none absolute -top-20 -right-20 size-56 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <h3
        id="qualifications-heading"
        className="relative flex items-center gap-3 text-lg font-semibold tracking-tight text-fg"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
          <LuAward aria-hidden="true" className="size-5" />
        </span>
        {title || "Qualifications"}
      </h3>

      <ul className="relative mt-6 space-y-3">
        {education.map(({ id, institution, qualification }) => {
          const completed = qualification.status === "completed";
          return (
            <li key={id} className="rounded-2xl border border-line bg-surface-2 p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-gradient text-3xl font-semibold tracking-tight">
                  {qualification.shortTitle}
                </p>
                <span
                  className={`text-sm font-medium ${completed ? "text-success" : "text-warning"}`}
                >
                  {statusText[qualification.status]}
                </span>
              </div>
              <p className="mt-2 font-medium text-fg">{qualification.title}</p>
              <p className="mt-0.5 text-[0.95rem] text-muted">{institution}</p>
              <p className="mt-2 text-sm text-muted">{qualification.statusLabel}</p>
            </li>
          );
        })}
      </ul>

      {note && <p className="relative mt-5 text-sm leading-6 text-muted">{note}</p>}
    </aside>
  );
}
