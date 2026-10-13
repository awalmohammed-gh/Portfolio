import Link from "next/link";
import { LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/data/services";

export default function ServicesPreview() {
  return (
    <section aria-labelledby="services-preview" className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="services-preview"
            eyebrow="Services"
            title="How I can help"
            description="From a single website to a complete web application with its own backend and database."
          />
          <ButtonLink href="/services" variant="secondary" className="reveal self-start md:self-auto">
            Explore services
            <LuArrowRight
              aria-hidden="true"
              className="size-4 transition group-hover/button:translate-x-0.5"
            />
          </ButtonLink>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ title, description, icon: Icon }) => (
            <li key={title} className="reveal">
              <Link
                href="/services"
                className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-6 shadow-card transition hover:-translate-y-1 hover:border-line-strong"
              >
                <span className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-2xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-accent-fg">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <LuArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-subtle transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
                  />
                </span>
                <span className="mt-5 text-lg font-semibold tracking-tight text-fg">{title}</span>
                <span className="mt-2 text-[0.95rem] leading-7 text-muted">{description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
