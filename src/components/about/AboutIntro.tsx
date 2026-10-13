import { LuArrowRight, LuGraduationCap, LuLaptop, LuLayers } from "react-icons/lu";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const facts = [
  { icon: LuLaptop, label: "Focus", value: "Full-stack web development" },
  { icon: LuGraduationCap, label: "Education", value: "BIT, Accra Institute of Technology" },
  { icon: LuLayers, label: "Portfolio", value: `${projects.length} full-stack projects` },
];

export default function AboutIntro() {
  return (
    <section aria-labelledby="about-intro" className="py-12 sm:py-16">
      <Container className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <figure className="reveal lg:sticky lg:top-28 lg:col-span-5">
          <div className="relative aspect-4/5 overflow-hidden rounded-4xl border border-line bg-surface-2 shadow-card">
            <ProfilePhoto sizes="(min-width: 1024px) 640px, 100vw" />
          </div>
          <figcaption className="mt-4 flex items-center justify-between text-sm text-muted">
            <span className="font-medium text-fg">{site.name}</span>
            <span>At work</span>
          </figcaption>
        </figure>

        <div className="lg:col-span-7">
          <div className="reveal">
            <Eyebrow>Who I am</Eyebrow>
            <h2
              id="about-intro"
              className="mt-4 text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
            >
              I build complete software, <span className="text-gradient">from interface to database.</span>
            </h2>
          </div>

          <div className="reveal mt-7 space-y-5 text-base leading-8 text-muted sm:text-lg sm:leading-8">
            <p>
              I’m {site.name}, a {site.title}. I build SaaS products and full-stack systems,
              taking an idea beyond the screen: the interface people interact with, the backend logic behind each
              action, and the database that holds it all together.
            </p>
            <p>
              I’ve completed my coursework for a Bachelor of Information Technology at Accra
              Institute of Technology, with graduation pending. Alongside that foundation, I’ve
              built e-commerce platforms, a real estate management platform, an employee management
              system, a car rental system with role-based dashboards, and a learning management
              system.
            </p>
            <p>
              On the frontend I work with React, Next.js, TypeScript and Tailwind CSS. On the
              backend I use Node.js, Express.js and MongoDB to build REST APIs, authentication and
              data-driven features. My focus is simple: clear interfaces, maintainable code, and
              software that solves real problems.
            </p>
          </div>

          <dl className="reveal mt-9 grid gap-3 sm:grid-cols-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
                <dt className="flex items-center gap-2 text-sm text-muted">
                  <Icon aria-hidden="true" className="size-4 text-accent" />
                  {label}
                </dt>
                <dd className="mt-2 font-medium text-fg">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="reveal mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/projects">
              View my projects
              <LuArrowRight
                aria-hidden="true"
                className="size-4 transition group-hover/button:translate-x-0.5"
              />
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
