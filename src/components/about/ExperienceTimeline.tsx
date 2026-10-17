import Image from "next/image";
import { LuBriefcase, LuCheck, LuMapPin } from "react-icons/lu";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Tag from "@/components/ui/Tag";
import { TechList } from "@/components/projects/ProjectMeta";
import { getContent, getExperience } from "@/lib/data/public";
import { formatYearMonth } from "@/lib/format";

/** Work experience timeline. Renders nothing until at least one entry is published. */
export default async function ExperienceTimeline() {
  const [copy, experience] = await Promise.all([getContent("experience"), getExperience()]);
  if (experience.length === 0) return null;

  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-24 py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="experience-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />
        <ol className="relative mt-12 space-y-5 before:absolute before:top-6 before:bottom-6 before:left-6 before:w-px before:bg-line">
          {experience.map((entry) => (
            <li key={entry.id} className="reveal relative flex gap-5">
              <span className="relative z-10 grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-surface text-accent shadow-card">
                {entry.logo ? (
                  <Image src={entry.logo.url} alt="" width={48} height={48} className="size-full object-cover" />
                ) : (
                  <LuBriefcase aria-hidden="true" className="size-5" />
                )}
              </span>
              <article className="flex-1 rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-7">
                <p className="font-mono text-xs font-medium tracking-[0.14em] text-accent uppercase">
                  {formatYearMonth(entry.startDate)} – {entry.current ? "Present" : formatYearMonth(entry.endDate)}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-fg">{entry.role}</h3>
                <p className="mt-1.5 text-base text-muted">
                  {entry.companyUrl ? (
                    <a href={entry.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                      {entry.company}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    entry.company
                  )}
                </p>
                {(entry.location || entry.employmentType) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.employmentType && <Tag>{entry.employmentType}</Tag>}
                    {entry.location && (
                      <Tag>
                        <LuMapPin aria-hidden="true" className="size-3.5" />
                        {entry.location}
                      </Tag>
                    )}
                  </div>
                )}
                {entry.description && (
                  <p className="mt-4 text-[0.95rem] leading-7 text-muted">{entry.description}</p>
                )}
                {entry.highlights.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {entry.highlights.map((item) => (
                      <li key={item} className="flex gap-2 text-[0.95rem] leading-7 text-fg">
                        <LuCheck aria-hidden="true" className="mt-1.5 size-4 shrink-0 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {entry.technologies.length > 0 && (
                  <div className="mt-5">
                    <TechList technologies={entry.technologies} />
                  </div>
                )}
              </article>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
