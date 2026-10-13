import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillGroups } from "@/data/skills";

export default function Skills() {
  return (
    <section aria-labelledby="skills" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="skills"
          eyebrow="Skills"
          title="Technologies I work with"
          description="Grouped across the full stack, from the browser to the server and the database."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {skillGroups.map(({ title, description, icon: GroupIcon, skills }) => (
            <article
              key={title}
              className="reveal rounded-3xl border border-line bg-surface p-6 shadow-card transition hover:border-line-strong sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
                  <GroupIcon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-fg">{title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-7 text-muted">{description}</p>
                </div>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {skills.map(({ name, icon: Icon }) => (
                  <li
                    key={name}
                    className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 py-2 text-[0.95rem] text-fg"
                  >
                    <Icon aria-hidden="true" className="size-4 text-accent" />
                    {name}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
