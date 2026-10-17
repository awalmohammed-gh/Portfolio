import Image from "next/image";
import { LuArrowRight, LuDownload } from "react-icons/lu";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Icon from "@/components/ui/Icon";
import { getContent, getPublishedProjects, getSiteSettings } from "@/lib/data/public";
import { fill } from "@/lib/format";

export default async function AboutIntro() {
  const [about, projects, settings] = await Promise.all([
    getContent("about"),
    getPublishedProjects(),
    getSiteSettings(),
  ]);
  const values = { count: projects.length };

  return (
    <section aria-labelledby="about-intro" className="py-12 sm:py-16">
      <Container className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <figure className="reveal lg:sticky lg:top-28 lg:col-span-5">
          <div className="relative aspect-4/5 overflow-hidden rounded-4xl border border-line bg-surface-2 shadow-card">
            {about.photo && (
              <Image
                src={about.photo.url}
                alt={about.photo.alt ?? ""}
                fill
                sizes="(min-width: 1024px) 640px, 100vw"
                className="profile-photo"
              />
            )}
          </div>
          <figcaption className="mt-4 flex items-center justify-between text-sm text-muted">
            <span className="font-medium text-fg">{settings.siteName}</span>
            <span>{about.photoCaption}</span>
          </figcaption>
        </figure>

        <div className="lg:col-span-7">
          <div className="reveal">
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <h2
              id="about-intro"
              className="mt-4 text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
            >
              {about.title.lead} <span className="text-gradient">{about.title.highlight}</span>
            </h2>
          </div>

          <div className="reveal mt-7 space-y-5 text-base leading-8 text-muted sm:text-lg sm:leading-8">
            {about.paragraphs.map((paragraph, index) => (
              <p key={index}>{fill(paragraph, values)}</p>
            ))}
          </div>

          {about.facts.length > 0 && (
            <dl className="reveal mt-9 grid gap-3 sm:grid-cols-3">
              {about.facts.map(({ icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
                  <dt className="flex items-center gap-2 text-sm text-muted">
                    <Icon name={icon} aria-hidden="true" className="size-4 text-accent" />
                    {label}
                  </dt>
                  <dd className="mt-2 font-medium text-fg">{fill(value, values)}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="reveal mt-9 flex flex-wrap gap-3">
            {about.primaryCta.label && about.primaryCta.href && (
              <ButtonLink href={about.primaryCta.href}>
                {about.primaryCta.label}
                <LuArrowRight
                  aria-hidden="true"
                  className="size-4 transition group-hover/button:translate-x-0.5"
                />
              </ButtonLink>
            )}
            {about.secondaryCta.label && about.secondaryCta.href && (
              <ButtonLink href={about.secondaryCta.href} variant="secondary">
                {about.secondaryCta.label}
              </ButtonLink>
            )}
            {about.resumeUrl && (
              <ButtonLink href={about.resumeUrl} variant="secondary" external>
                <LuDownload aria-hidden="true" className="size-4" />
                {about.resumeLabel || "Résumé"}
              </ButtonLink>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
