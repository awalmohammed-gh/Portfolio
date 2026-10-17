import type { ReactNode } from "react";
import Container from "./Container";
import Eyebrow from "./Eyebrow";

export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <Container className="relative pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="animate-fade-up">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1 className="mt-5 max-w-4xl animate-fade-up text-4xl font-semibold tracking-tight text-balance text-fg [animation-delay:80ms] sm:text-5xl lg:text-6xl lg:leading-[1.05]">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-8 text-pretty text-muted [animation-delay:160ms]">
          {description}
        </p>
        {children && (
          <div className="mt-8 animate-fade-up [animation-delay:240ms]">{children}</div>
        )}
      </Container>
    </section>
  );
}
