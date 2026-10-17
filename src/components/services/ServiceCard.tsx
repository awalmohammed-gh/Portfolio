import Link from "next/link";
import { LuArrowRight, LuCheck } from "react-icons/lu";
import Icon from "@/components/ui/Icon";
import type { Service } from "@/types/content";

export default function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { title, description, icon, includes } = service;

  return (
    <article className="group reveal relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-7 shadow-card transition hover:-translate-y-1 hover:border-line-strong">
      <div
        className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-accent/0 blur-2xl transition group-hover:bg-accent/15"
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-accent-fg">
          <Icon name={icon} aria-hidden="true" className="size-5" />
        </span>
        <span className="font-mono text-sm text-subtle">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <h3 className="relative mt-6 text-xl font-semibold tracking-tight text-fg">{title}</h3>
      <p className="relative mt-3 text-[0.95rem] leading-7 text-muted">{description}</p>

      <ul className="relative mt-6 space-y-2.5 border-t border-line pt-5">
        {includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[0.95rem] text-fg">
            <LuCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent" />
            {item}
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        className="relative mt-auto inline-flex items-center gap-1.5 pt-7 text-[0.95rem] font-medium text-accent hover:text-accent-hover"
      >
        Discuss this service
        <LuArrowRight aria-hidden="true" className="size-4 transition group-hover:translate-x-0.5" />
        <span className="sr-only">: {title}</span>
      </Link>
    </article>
  );
}
