import Image from "next/image";
import { FaArrowRight, FaDatabase, FaLaptopCode, FaServer } from "react-icons/fa6";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import { coreStack, site } from "@/data/site";

const layers = [
  { icon: FaLaptopCode, label: "Frontend", detail: "React · Next.js", position: "-left-4 top-10 sm:-left-10" },
  { icon: FaServer, label: "Backend", detail: "Node.js · Express", position: "-right-3 top-1/2 sm:-right-8" },
  { icon: FaDatabase, label: "Database", detail: "MongoDB", position: "-left-2 bottom-8 sm:-left-6" },
];

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <Container className="relative grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent ring-1 ring-accent/25">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {site.title}
          </p>

          <h1
            id="hero-heading"
            className="mt-6 animate-fade-up text-4xl leading-[1.1] font-bold tracking-tight text-ink [animation-delay:80ms] sm:text-5xl lg:text-6xl"
          >
            Building Digital Experiences From{" "}
            <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
              Frontend to Backend.
            </span>
          </h1>

          <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-ink [animation-delay:160ms]">
            {site.heroIntro}
          </p>
          <p className="mt-4 max-w-xl animate-fade-up leading-relaxed text-ink-muted [animation-delay:220ms]">
            {site.heroDescription}
          </p>

          <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:280ms]">
            <ButtonLink href="/projects">
              View Projects <FaArrowRight aria-hidden className="size-3" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Contact Me
            </ButtonLink>
          </div>

          <ul
            className="mt-10 flex animate-fade-up flex-wrap gap-2 [animation-delay:340ms]"
            aria-label="Core technologies"
          >
            {coreStack.map((tech) => (
              <li
                key={tech}
                className="rounded-md bg-navy-900 px-2.5 py-1 font-mono text-xs text-ink-muted ring-1 ring-white/5"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-up [animation-delay:200ms] lg:col-span-5">
          <div className="relative mx-auto max-w-sm">
            <div
              className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-accent/40 via-accent/5 to-transparent blur-2xl"
              aria-hidden
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-white/15">
              <Image
                src={site.profileImage.src}
                alt={site.profileImage.alt}
                fill
                preload
                sizes="(min-width: 640px) 384px, 90vw"
                className="origin-[64%_56%] scale-[1.4] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/70 to-transparent" />
            </div>

            {layers.map(({ icon: Icon, label, detail, position }, i) => (
              <div
                key={label}
                className={`absolute ${position} flex animate-float items-center gap-3 rounded-xl bg-navy-900/90 px-3 py-2.5 shadow-xl ring-1 ring-white/10 backdrop-blur`}
                style={{ animationDelay: `${i * 1.2}s` }}
                aria-hidden
              >
                <span className="grid size-8 place-items-center rounded-lg bg-accent/15 text-accent">
                  <Icon className="size-4" />
                </span>
                <span className="leading-tight">
                  <span className="block text-xs font-semibold text-ink">{label}</span>
                  <span className="block text-[11px] text-ink-muted">{detail}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
