import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuArrowUpRight } from "react-icons/lu";
import ButtonLink from "@/components/ui/ButtonLink";
import Icon from "@/components/ui/Icon";
import SkillIcon from "@/components/ui/SkillIcon";
import { getContent, getEducation, getPublishedProjects, getSkillGroups } from "@/lib/data/public";
import styles from "./Hero.module.css";

export default async function Hero() {
  const [hero, projects, skillGroups, education] = await Promise.all([
    getContent("hero"),
    getPublishedProjects(),
    getSkillGroups(),
    getEducation(),
  ]);

  const allSkills = skillGroups.flatMap((group) => group.skills);
  const heroStack = hero.coreStack
    .map((name) => allSkills.find((skill) => skill.name === name))
    .filter((skill) => skill !== undefined);
  const latestEducation = education[0];

  return (
    <section aria-labelledby="hero-heading" className={styles.hero}>
      <div className={`${styles.banner} ${!hero.image ? styles.withoutImage : ""}`}>
          {hero.image && (
            <div className={styles.visual} data-hero-layer="image">
              <Image
                src={hero.image.url}
                alt={hero.image.alt ?? ""}
                fill
                preload
                sizes="(min-width: 1328px) 1280px, (min-width: 768px) calc(100vw - 3rem), calc(100vw - 1.5rem)"
                style={{ objectFit: "cover", objectPosition: "64% 58%" }}
              />
            </div>
          )}
          {hero.image && <div className={styles.photoShade} data-hero-layer="overlay" aria-hidden="true" />}
        <div className={styles.heroGrid} data-hero-layer="content">
          <div className={styles.copy}>
            {hero.badge && (
              <p className={styles.badge}>
                <span className={styles.badgeDot} aria-hidden="true" />
                {hero.badge}
              </p>
            )}

            <h1 id="hero-heading" className={styles.heading}>
              {hero.heading.lead}{" "}
              <span className={styles.highlight}>{hero.heading.highlight}</span>
            </h1>

            {hero.intro && (
              <p className={styles.intro}>{hero.intro}</p>
            )}
            {hero.description && (
              <p className={styles.description}>{hero.description}</p>
            )}

            <div className={styles.actions}>
              {hero.primaryCta.label && hero.primaryCta.href && (
                <ButtonLink href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <LuArrowUpRight aria-hidden="true" className="size-4 transition group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
                </ButtonLink>
              )}
              {hero.secondaryCta.label && hero.secondaryCta.href && (
                <ButtonLink href={hero.secondaryCta.href} variant="secondary" className={styles.secondaryCta}>
                  {hero.secondaryCta.label}
                  <LuArrowRight aria-hidden="true" className="size-4 transition group-hover/button:translate-x-0.5" />
                </ButtonLink>
              )}
            </div>
          </div>

        </div>

        {/* Desktop inline details inside banner */}
        <div className={`${styles.details} hidden md:grid ${!latestEducation ? styles.withoutEducation : ""} ${heroStack.length === 0 ? styles.withoutStack : ""}`} data-hero-layer="content">
          {heroStack.length > 0 && (
            <div className={styles.stack}>
              {hero.coreStackTitle && <h2 className="text-[0.65rem] font-semibold tracking-[0.14em] text-subtle uppercase">{hero.coreStackTitle}</h2>}
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Core technologies">
                {heroStack.map((skill) => (
                  <li key={skill.id} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-fg">
                    <SkillIcon skill={skill} className="size-3.5 shrink-0 text-accent" />
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link href="/projects" className={`${styles.projectSummary} group`}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-subtle uppercase">{hero.projectsCardLabel || "Projects"}</p>
              <LuArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-accent transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-4xl font-semibold tracking-tight text-fg">{String(projects.length).padStart(2, "0")}</span>
              {hero.projectsCardCaption && <span className="text-xs leading-5 text-muted">{hero.projectsCardCaption}</span>}
            </div>
          </Link>

          {latestEducation && (
            <Link href="/about#education" className={`${styles.education} group`}>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-accent">
                <Icon name={latestEducation.icon} aria-hidden="true" className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm leading-6 font-semibold text-fg">{latestEducation.qualification.title}</span>
                <span className="mt-0.5 block text-xs leading-5 text-muted">{latestEducation.institution}</span>
                <span className={`mt-1 block text-xs leading-5 ${latestEducation.qualification.status === "completed" ? "text-success" : "text-warning"}`}>
                  {latestEducation.qualification.statusLabel}
                </span>
              </span>
              <LuArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-subtle transition group-hover:text-accent" />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile details below the hero banner so the hero banner fits the mobile screen height */}
      <div className={`${styles.details} grid md:hidden mt-3 ${!latestEducation ? styles.withoutEducation : ""} ${heroStack.length === 0 ? styles.withoutStack : ""}`}>
        {heroStack.length > 0 && (
          <div className={styles.stack}>
            {hero.coreStackTitle && <h2 className="text-[0.65rem] font-semibold tracking-[0.14em] text-subtle uppercase">{hero.coreStackTitle}</h2>}
            <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Core technologies">
              {heroStack.map((skill) => (
                <li key={skill.id} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-fg">
                  <SkillIcon skill={skill} className="size-3 shrink-0 text-accent" />
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link href="/projects" className={`${styles.projectSummary} group`}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-subtle uppercase">{hero.projectsCardLabel || "Projects"}</p>
            <LuArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-accent transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-semibold tracking-tight text-fg">{String(projects.length).padStart(2, "0")}</span>
            {hero.projectsCardCaption && <span className="text-xs leading-5 text-muted">{hero.projectsCardCaption}</span>}
          </div>
        </Link>

        {latestEducation && (
          <Link href="/about#education" className={`${styles.education} group`}>
            <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface text-accent">
              <Icon name={latestEducation.icon} aria-hidden="true" className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm leading-5 font-semibold text-fg">{latestEducation.qualification.title}</span>
              <span className="mt-0.5 block text-xs leading-4 text-muted">{latestEducation.institution}</span>
            </span>
            <LuArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-subtle transition group-hover:text-accent" />
          </Link>
        )}
      </div>
    </section>
  );
}
