import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillIcon from "@/components/ui/SkillIcon";
import { getContent, getSkillGroups } from "@/lib/data/public";

export default async function FullStackOverview() {
  const [overview, skillGroups] = await Promise.all([getContent("fullStack"), getSkillGroups()]);
  if (overview.layers.length === 0) return null;

  return (
    <section aria-labelledby="what-i-build" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="what-i-build"
          eyebrow={overview.eyebrow}
          title={overview.title}
          description={overview.description}
        />

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {overview.layers.map(({ category, label, heading, text }, index) => {
            const skillGroup = skillGroups.find((g) => g.title === category);
            if (!skillGroup) return null;
            return (
              <li
                key={`${category}-${index}`}
                className="reveal group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface p-7 shadow-card transition hover:border-line-strong"
              >
                <div
                  className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/20"
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                    <Icon name={skillGroup.icon} aria-hidden="true" className="size-5" />
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
                  {skillGroup.skills.map((skill) => (
                    <li
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-sm text-fg"
                    >
                      <SkillIcon skill={skill} className="size-3.5 text-accent" />
                      {skill.name}
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
