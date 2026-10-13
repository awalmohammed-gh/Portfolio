import type { Metadata } from "next";
import { FaGraduationCap } from "react-icons/fa6";
import AboutIntro from "@/components/about/AboutIntro";
import Education from "@/components/about/Education";
import Qualifications from "@/components/about/Qualifications";
import Skills from "@/components/about/Skills";
import CallToAction from "@/components/ui/CallToAction";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Mohammed Awal, a Full-Stack Web Developer & Software Engineer: background, skills, education and qualifications.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About me"
        title="Full-Stack Web Developer & Software Engineer"
        description="I design and build web applications end to end, from responsive user interfaces to backend services and databases."
      />

      <AboutIntro />

      <div className="border-y border-white/5 bg-navy-900/40">
        <Skills />
      </div>

      <section aria-labelledby="education" className="py-20">
        <Container>
          <div className="reveal max-w-2xl">
            <p className="font-mono text-xs font-medium tracking-[0.2em] text-accent uppercase">
              Education
            </p>
            <h2
              id="education"
              className="mt-3 flex items-center gap-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                <FaGraduationCap aria-hidden className="size-5" />
              </span>
              Education &amp; Qualifications
            </h2>
            <p className="mt-4 leading-relaxed text-ink-muted">
              My academic background in information technology, from senior high school to
              university.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="pl-5 lg:col-span-7">
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
