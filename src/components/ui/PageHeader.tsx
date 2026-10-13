import type { ReactNode } from "react";
import Container from "./Container";

export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <Container className="relative py-16 sm:py-20">
        <p className="animate-fade-up font-mono text-xs font-medium tracking-[0.2em] text-accent uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl animate-fade-up text-4xl font-bold tracking-tight text-ink [animation-delay:80ms] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl animate-fade-up text-lg leading-relaxed text-ink-muted [animation-delay:160ms]">
          {description}
        </p>
      </Container>
    </section>
  );
}
