import Image from "next/image";
import { FaArrowRight, FaGraduationCap, FaLayerGroup, FaLaptopCode } from "react-icons/fa6";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const facts = [
  { icon: FaLaptopCode, label: "Focus", value: "Full-stack web development" },
  { icon: FaGraduationCap, label: "Education", value: "BIT, Accra Institute of Technology" },
  { icon: FaLayerGroup, label: "Portfolio", value: `${projects.length} full-stack projects` },
];

export default function AboutIntro() {
  return (
    <section aria-labelledby="about-intro" className="py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-12">
        <div className="reveal lg:col-span-5">
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <div
              className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent/30 to-transparent blur-2xl"
              aria-hidden
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-white/10">
              <Image
                src={site.profileImage.src}
                alt={site.profileImage.alt}
                fill
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 384px, 100vw"
                className="object-cover object-[62%_60%]"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <p className="reveal font-mono text-xs font-medium tracking-[0.2em] text-accent uppercase">
            Who I am
          </p>
          <h2
            id="about-intro"
            className="reveal mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            I build complete software, from interface to database.
          </h2>
          <div className="reveal mt-6 space-y-4 leading-relaxed text-ink-muted">
            <p>
              I&apos;m {site.name}, a {site.title}. I build complete web applications: the
              interfaces people use, the backend logic that powers them, and the databases that
              keep their information organised.
            </p>
            <p>
              I have completed my coursework for a Bachelor of Information Technology at Accra
              Institute of Technology, and I&apos;ve applied that foundation to full-stack projects
              including e-commerce platforms, a real estate management platform, an employee
              management system, a car rental system with role-based dashboards, and a learning
              management system.
            </p>
            <p>
              On the frontend I work with React, Next.js, TypeScript and Tailwind CSS. On the
              backend I use Node.js, Express.js and MongoDB to build REST APIs, authentication and
              data-driven features. I care about clean code, responsive design, and software that
              solves real problems.
            </p>
          </div>

          <dl className="reveal mt-8 grid gap-3 sm:grid-cols-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-navy-900/70 p-4 ring-1 ring-white/5">
                <dt className="flex items-center gap-2 text-xs text-ink-subtle">
                  <Icon aria-hidden className="text-accent" />
                  {label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="reveal mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/projects">
              View my projects <FaArrowRight aria-hidden className="size-3" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Get in touch
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
