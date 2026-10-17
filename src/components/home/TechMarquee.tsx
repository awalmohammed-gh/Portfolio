import SkillIcon from "@/components/ui/SkillIcon";
import { getSkillGroups } from "@/lib/data/public";
import type { Skill } from "@/types/content";

function SkillRow({ skills, duplicate = false }: { skills: Skill[]; duplicate?: boolean }) {
  return (
    <ul
      className={`flex shrink-0 gap-3 pr-3 ${duplicate ? "marquee-duplicate" : ""}`}
      aria-hidden={duplicate || undefined}
    >
      {skills.map((skill) => (
        <li
          key={skill.id}
          className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm whitespace-nowrap text-fg"
        >
          <SkillIcon skill={skill} className="size-4 text-accent" />
          {skill.name}
        </li>
      ))}
    </ul>
  );
}

/** Continuously scrolling skill strip; pauses on hover and wraps when motion is reduced. */
export default async function TechMarquee() {
  const allSkills = (await getSkillGroups()).flatMap((group) => group.skills);
  if (allSkills.length === 0) return null;

  return (
    <section aria-label="Technologies I work with" className="py-6">
      <div className="marquee overflow-hidden">
        <div className="marquee-track flex w-max animate-marquee">
          <SkillRow skills={allSkills} />
          <SkillRow skills={allSkills} duplicate />
        </div>
      </div>
    </section>
  );
}
