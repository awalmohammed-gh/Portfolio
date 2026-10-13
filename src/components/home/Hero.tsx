import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuArrowUpRight, LuGraduationCap } from "react-icons/lu";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { skillGroups } from "@/data/skills";

// Core stack shown in the hero, pulled from the skills data so icons stay in sync.
const heroStack = ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "REST APIs"]
  .map((name) => skillGroups.flatMap((g) => g.skills).find((s) => s.name === name))
  .filter((s) => s !== undefined);

const card = "rounded-3xl border border-line bg-surface shadow-card";

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative">
      {/* Banner: photo with overlay, content on top */}
      <div className="relative isolate flex min-h-[860px] items-end overflow-hidden sm:min-h-[1000px] lg:min-h-[760px] lg:items-center">
        <Image
          src={site.profileImage.src}
          alt={site.profileImage.alt}
          fill
          preload
          sizes="100vw"
          className="-z-20 origin-[64%_100%] scale-150 object-cover object-[64%_50%] lg:origin-center lg:scale-100 lg:object-[64%_52%]"
        />
        {/* Overlay: darkest behind the text (bottom below lg, left on large screens) */}
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(8_8_12/0.96)_0%,rgb(8_8_12/0.85)_45%,rgb(8_8_12/0.35)_75%,rgb(8_8_12/0.2)_100%)] lg:bg-[linear-gradient(to_right,rgb(8_8_12/0.94)_0%,rgb(8_8_12/0.82)_38%,rgb(8_8_12/0.35)_68%,rgb(8_8_12/0.15)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(55%_65%_at_10%_30%,rgb(79_70_229/0.38),transparent_70%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-bg to-transparent"
          aria-hidden="true"
        />

        <Container className="relative pt-24 pb-36 sm:pt-28 lg:pb-40">
          <div className="max-w-2xl text-white">
            <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-medium backdrop-blur-md">
              <span className="size-2 rounded-full bg-[linear-gradient(135deg,#a5b4fc,#67e8f9)]" aria-hidden="true" />
              {site.title}
            </p>

            <h1
              id="hero-heading"
              className="mt-6 animate-fade-up text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-balance [animation-delay:80ms] sm:text-6xl lg:text-7xl"
            >
              Building Digital Experiences From{" "}
              <span className="bg-[linear-gradient(100deg,#a5b4fc_10%,#67e8f9_90%)] bg-clip-text text-transparent">
                Frontend to Backend.
              </span>
            </h1>

            <p className="mt-6 animate-fade-up text-lg leading-8 text-pretty text-white/90 [animation-delay:160ms]">
              {site.heroIntro}
            </p>
            <p className="mt-3 hidden animate-fade-up text-base leading-7 text-pretty text-white/75 [animation-delay:200ms] lg:block">
              {site.heroDescription}
            </p>

            <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:260ms]">
              <ButtonLink href="/projects">
                View Projects
                <LuArrowRight
                  aria-hidden="true"
                  className="size-4 transition group-hover/button:translate-x-0.5"
                />
              </ButtonLink>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-[0.95rem] font-medium text-white backdrop-blur-md transition hover:bg-white/20"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Info cards overlapping the bottom of the banner */}
      <Container className="relative z-10 -mt-24 pb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <div className={`${card} animate-fade-up p-6 [animation-delay:320ms] sm:col-span-2 sm:p-8 lg:col-span-5`}>
            <p className="text-sm font-medium text-muted">Core stack</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Core technologies">
              {heroStack.map(({ name, icon: Icon }) => (
                <li
                  key={name}
                  className="flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm text-fg"
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0 text-accent" />
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/projects"
            className={`${card} group flex animate-fade-up flex-col justify-between gap-6 p-6 transition [animation-delay:380ms] hover:border-line-strong sm:p-8 lg:col-span-3`}
          >
            <span className="flex items-start justify-between">
              <span className="text-sm font-medium text-muted">Portfolio</span>
              <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-accent-fg">
                <LuArrowUpRight aria-hidden="true" className="size-4" />
              </span>
            </span>
            <span>
              <span className="block text-5xl font-semibold tracking-tight text-fg">
                {projects.length}
              </span>
              <span className="mt-1 block text-[0.95rem] text-muted">Full-stack projects</span>
            </span>
          </Link>

          <Link
            href="/about#education"
            className={`${card} group flex animate-fade-up flex-col justify-between gap-6 p-6 transition [animation-delay:440ms] hover:border-line-strong sm:p-8 lg:col-span-4`}
          >
            <span className="flex items-start justify-between">
              <span className="grid size-11 place-items-center rounded-2xl bg-accent-soft text-accent">
                <LuGraduationCap aria-hidden="true" className="size-5" />
              </span>
              <LuArrowRight
                aria-hidden="true"
                className="size-5 text-subtle transition group-hover:translate-x-1 group-hover:text-fg"
              />
            </span>
            <span>
              <span className="block font-semibold text-fg">Bachelor of Information Technology</span>
              <span className="mt-1 block text-[0.95rem] text-muted">
                Accra Institute of Technology
              </span>
              <span className="mt-1 block text-sm text-warning">
                Coursework completed · Awaiting graduation
              </span>
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
