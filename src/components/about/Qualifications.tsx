import { FaAward } from "react-icons/fa6";
import { education } from "@/data/education";

/** Compact summary of qualifications, derived from the education data. */
export default function Qualifications() {
  return (
    <aside
      aria-labelledby="qualifications-heading"
      className="reveal rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/80 p-6 ring-1 ring-white/10"
    >
      <h3 id="qualifications-heading" className="flex items-center gap-2 font-semibold text-ink">
        <FaAward aria-hidden className="text-accent" />
        Qualifications
      </h3>

      <ul className="mt-5 space-y-4">
        {education.map(({ id, institution, qualification }) => {
          const completed = qualification.status === "completed";
          return (
            <li key={id} className="rounded-xl bg-navy-950/60 p-4 ring-1 ring-white/5">
              <p className="font-mono text-2xl font-bold text-accent">{qualification.shortTitle}</p>
              <p className="mt-1 text-sm font-medium text-ink">{qualification.title}</p>
              <p className="mt-0.5 text-sm text-ink-muted">{institution}</p>
              <p
                className={`mt-3 text-xs font-medium ${completed ? "text-emerald-300" : "text-amber-300"}`}
              >
                {qualification.statusLabel}
              </p>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-xs leading-relaxed text-ink-subtle">
        The Bachelor of Information Technology will be formally conferred upon graduation.
      </p>
    </aside>
  );
}
