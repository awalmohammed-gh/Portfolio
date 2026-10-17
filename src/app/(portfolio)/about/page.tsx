import AboutIntro from "@/components/about/AboutIntro";
import Education from "@/components/about/Education";
import ExperienceTimeline from "@/components/about/ExperienceTimeline";
import Qualifications from "@/components/about/Qualifications";
import Skills from "@/components/about/Skills";
import CallToAction from "@/components/ui/CallToAction";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { getContent, getEducation } from "@/lib/data/public";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const about = await getContent("about");
  return pageMetadata("/about", about.seo);
}

export default async function AboutPage() {
  const [about, educationCopy, education] = await Promise.all([
    getContent("about"),
    getContent("education"),
    getEducation(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={about.header.eyebrow}
        title={
          <>
            {about.header.title.lead} <span className="text-gradient">{about.header.title.highlight}</span>
          </>
        }
        description={about.header.description}
      />

      <AboutIntro />
      <Skills />
      <ExperienceTimeline />

      {education.length > 0 && (
        <section id="education" aria-labelledby="education-heading" className="scroll-mt-24 py-16 sm:py-24">
          <Container>
            <SectionHeading
              id="education-heading"
              eyebrow={educationCopy.eyebrow}
              title={educationCopy.title}
              description={educationCopy.description}
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Education education={education} />
              </div>
              <div className="lg:col-span-5">
                <Qualifications
                  education={education}
                  title={educationCopy.qualificationsTitle}
                  note={educationCopy.qualificationsNote}
                />
              </div>
            </div>
          </Container>
        </section>
      )}

      <CallToAction />
    </>
  );
}
