import type { Metadata } from "next";
import AboutIntro from "@/components/about/AboutIntro";
import Education from "@/components/about/Education";
import Qualifications from "@/components/about/Qualifications";
import Skills from "@/components/about/Skills";
import CallToAction from "@/components/ui/CallToAction";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Mohammed Awal, a Web Developer who builds SaaS products and full-stack systems: background, skills, education and qualifications.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About me"
        title={
          <>
            Web Developer building <span className="text-gradient">SaaS &amp; full-stack systems.</span>
          </>
        }
        description="I design and build web applications and SaaS products end to end, covering the user interface, the backend services, and the database."
      />

      <AboutIntro />
      <Skills />

      <section id="education" aria-labelledby="education-heading" className="scroll-mt-24 py-16 sm:py-24">
        <Container>
          <SectionHeading
            id="education-heading"
            eyebrow="Education"
            title="Education & Qualifications"
            description="My academic background in information technology, from senior high school to university."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Education />
            </div>
            <div className="lg:col-span-5">
              <Qualifications />
            </div>
          </div>
        </Container>
      </section>

      <CallToAction />
    </>
  );
}
