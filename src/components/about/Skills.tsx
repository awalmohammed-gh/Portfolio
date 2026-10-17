import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillIcon from "@/components/ui/SkillIcon";
import { getContent, getSkillGroups } from "@/lib/data/public";

export default async function Skills() {
  const [copy, skillGroups] = await Promise.all([getContent("skills"), getSkillGroups()]);
  const groups = skillGroups.filter((group) => group.skills.length > 0);
  if (groups.length === 0) return null;

  return (
    <section aria-labelledby="skills" className="py-16 sm:py-24">
      <Container>
        <SectionHeading id="skills" eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {groups.map(({ id, title, description, icon, skills }) => (
            <article
              key={id}
              className="reveal rounded-3xl border border-line bg-surface p-6 shadow-card transition hover:border-line-strong sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
                  <Icon name={icon} aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-fg">{title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-7 text-muted">{description}</p>
                </div>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 py-2 text-[0.95rem] text-fg"
                  >
                    <SkillIcon skill={skill} className="size-4 text-accent" />
                    {skill.name}
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
