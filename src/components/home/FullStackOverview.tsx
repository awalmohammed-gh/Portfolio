import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillGroups } from "@/data/skills";

const stackLayers = [
  {
    group: "Frontend Development",
    heading: "Interfaces people enjoy using",
    text: "Responsive, accessible user interfaces built with modern component-based tooling.",
  },
  {
    group: "Backend Development",
    heading: "Logic that powers the product",
    text: "Server-side applications, REST APIs, and authentication that keep data and users secure.",
  },
  {
    group: "Database",
    heading: "Data that stays organised",
    text: "Well-structured data models for products, orders, users, records, and more.",
  },
];

export default function FullStackOverview() {
  return (
    <section aria-labelledby="what-i-build" className="border-y border-white/5 bg-navy-900/40 py-20">
      <Container>
        <SectionHeading
          id="what-i-build"
          eyebrow="What I build"
          title="Complete systems, not just screens"
          description="Every project I take on can cover the full stack: what users see, the server behind it, and the data underneath."
          align="center"
        />

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {stackLayers.map(({ group, heading, text }, index) => {
            const skillGroup = skillGroups.find((g) => g.title === group);
            if (!skillGroup) return null;
            const Icon = skillGroup.icon;
            return (
              <li
                key={group}
                className="reveal relative flex flex-col rounded-2xl bg-navy-900 p-6 ring-1 ring-white/5 transition hover:ring-accent/30"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-ink-subtle">0{index + 1}</span>
                </div>
                <p className="mt-5 font-mono text-xs text-accent">{group.replace(" Development", "")}</p>
                <h3 className="mt-1 text-lg font-semibold text-ink">{heading}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
                <ul className="mt-5 flex flex-wrap gap-2 pt-1">
                  {skillGroup.skills.map(({ name, icon: SkillIcon }) => (
                    <li key={name} title={name} className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                      <SkillIcon aria-hidden className="size-3.5 text-accent-soft" />
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
