import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillGroups } from "@/data/skills";

const layers = [
  {
    group: "Frontend Development",
    label: "Frontend",
    heading: "Interfaces people enjoy using",
    text: "Responsive, accessible user interfaces that make browsing, buying, and managing feel straightforward.",
  },
  {
    group: "Backend Development",
    label: "Backend",
    heading: "Logic that powers the product",
    text: "Server-side applications, REST APIs, and authentication that connect every action to what happens next.",
  },
  {
    group: "Database",
    label: "Database",
    heading: "Data that stays organised",
    text: "Structured data models for the products, people, and records an application depends on.",
  },
];

export default function FullStackOverview() {
  return (
    <section aria-labelledby="what-i-build" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="what-i-build"
          eyebrow="What I build"
          title="Complete systems, from the interface to the database"
          description="Every project can cover the full stack: what users see, the server behind it, and the data underneath."
        />

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {layers.map(({ group, label, heading, text }, index) => {
            const skillGroup = skillGroups.find((g) => g.title === group);
            if (!skillGroup) return null;
            const Icon = skillGroup.icon;
            return (
              <li
                key={group}
                className="reveal group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface p-7 shadow-card transition hover:border-line-strong"
              >
                <div
                  className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/20"
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="font-mono text-sm text-subtle">0{index + 1}</span>
                </div>
                <p className="relative mt-6 font-mono text-xs font-medium tracking-[0.14em] text-accent uppercase">
                  {label}
                </p>
                <h3 className="relative mt-2 text-xl font-semibold tracking-tight text-fg">
                  {heading}
                </h3>
                <p className="relative mt-3 text-[0.95rem] leading-7 text-muted">{text}</p>
                <ul className="relative mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
                  {skillGroup.skills.map(({ name, icon: SkillIcon }) => (
                    <li
                      key={name}
                      className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-sm text-fg"
                    >
                      <SkillIcon aria-hidden="true" className="size-3.5 text-accent" />
                      {name}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
