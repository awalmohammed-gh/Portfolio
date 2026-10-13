import Link from "next/link";
import type { ReactNode } from "react";
import { LuArrowUpRight, LuMail } from "react-icons/lu";
import { site } from "@/data/site";
import Container from "./Container";

export default function CallToAction({
  title = "Have a project in mind? Let’s build it together.",
  description = "Whether you need a website, a SaaS product, a full-stack web application, or a custom management system, I’d love to hear what you’re planning.",
}: {
  title?: ReactNode;
  description?: string;
}) {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="cta-title">
      <Container>
        <div className="reveal relative overflow-hidden rounded-4xl bg-[linear-gradient(120deg,#4338ca_0%,#6d28d9_55%,#0e7490_100%)] px-6 py-14 text-white sm:px-12 sm:py-16 lg:px-16">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.14)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_left,black,transparent_70%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <h2
                id="cta-title"
                className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl lg:leading-[1.08]"
              >
                {title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8">
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <Link
                href="/contact"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[0.95rem] font-medium text-[#3730a3] transition hover:bg-white/90"
              >
                Start a conversation
                <LuArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-6 text-[0.95rem] font-medium text-white transition hover:bg-white/10"
              >
                <LuMail aria-hidden="true" className="size-4" />
                Email me
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
