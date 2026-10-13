import { FaArrowRight } from "react-icons/fa6";
import ButtonLink from "./ButtonLink";
import Container from "./Container";

export default function CallToAction({
  title = "Have a project in mind?",
  description = "Whether you need a website, a full-stack web application, or a custom management system, I'd love to hear about it.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="py-20">
      <Container>
        <div className="reveal relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 to-navy-900 px-6 py-14 text-center ring-1 ring-accent/20 sm:px-12">
          <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
          <div
            className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-muted">{description}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/contact">
                Start a conversation <FaArrowRight aria-hidden className="size-3" />
              </ButtonLink>
              <ButtonLink href="/projects" variant="secondary">
                See my work
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
