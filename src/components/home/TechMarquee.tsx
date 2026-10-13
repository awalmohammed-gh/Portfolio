import { skillGroups } from "@/data/skills";

const allSkills = skillGroups.flatMap((group) => group.skills);

function SkillRow({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      className={`flex shrink-0 gap-3 pr-3 ${duplicate ? "marquee-duplicate" : ""}`}
      aria-hidden={duplicate || undefined}
    >
      {allSkills.map(({ name, icon: Icon }) => (
        <li
          key={name}
          className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm whitespace-nowrap text-fg"
        >
          <Icon aria-hidden="true" className="size-4 text-accent" />
          {name}
        </li>
      ))}
    </ul>
  );
}

/** Continuously scrolling skill strip; pauses on hover and wraps when motion is reduced. */
export default function TechMarquee() {
  return (
    <section aria-label="Technologies I work with" className="py-6">
      <div className="marquee overflow-hidden">
        <div className="marquee-track flex w-max animate-marquee">
          <SkillRow />
          <SkillRow duplicate />
        </div>
      </div>
    </section>
  );
}
