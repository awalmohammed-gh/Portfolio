import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillGroups } from "@/data/skills";

export default function Skills() {
  return (
    <section aria-labelledby="skills" className="py-20">
      <Container>
        <SectionHeading
          id="skills"
          eyebrow="Skills"
          title="Technologies I work with"
          description="Grouped across the full stack, from the browser to the server and the database."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {skillGroups.map(({ title, description, icon: GroupIcon, skills }) => (
            <article
              key={title}
              className="reveal rounded-2xl bg-navy-900/70 p-6 ring-1 ring-white/5 transition hover:ring-accent/30"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                  <GroupIcon aria-hidden className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{description}</p>
                </div>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {skills.map(({ name, icon: Icon }) => (
                  <li
                    key={name}
                    className="inline-flex items-center gap-2 rounded-lg bg-navy-800/80 px-3 py-2 text-sm text-ink ring-1 ring-white/5"
                  >
                    <Icon aria-hidden className="size-4 text-accent-soft" />
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
