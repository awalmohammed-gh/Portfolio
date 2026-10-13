import { FaCheck } from "react-icons/fa6";
import type { Service } from "@/types/content";

export default function ServiceCard({
  service,
  index,
  detailed = false,
}: {
  service: Service;
  index: number;
  detailed?: boolean;
}) {
  const { title, description, icon: Icon, includes } = service;

  return (
    <article className="group reveal flex h-full flex-col rounded-2xl bg-navy-900/70 p-6 ring-1 ring-white/5 transition hover:-translate-y-1 hover:ring-accent/30">
      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 transition group-hover:bg-accent group-hover:text-navy-950">
          <Icon aria-hidden className="size-5" />
        </span>
        <span className="font-mono text-xs text-ink-subtle">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>

      {detailed && (
        <ul className="mt-auto space-y-2 border-t border-white/5 pt-5">
          {includes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
              <FaCheck aria-hidden className="mt-1 size-3 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
