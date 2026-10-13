import type { Metadata } from "next";
import FullStackOverview from "@/components/home/FullStackOverview";
import ServiceCard from "@/components/services/ServiceCard";
import CallToAction from "@/components/ui/CallToAction";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website development, SaaS products, full-stack web applications, e-commerce systems, custom management systems, dashboards, and website redesign.",
};

const process = [
  {
    title: "Understand the problem",
    text: "We discuss your users, your goals, and the workflows the product needs to support.",
  },
  {
    title: "Build the full system",
    text: "I bring the interface, application logic, and data model together around those needs.",
  },
  {
    title: "Refine the experience",
    text: "We review the result, work through feedback, and check the details across screen sizes.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            Frontend interfaces <span className="text-gradient">and the backend behind them.</span>
          </>
        }
        description="I build both what your users see and the systems that power it, from business websites to SaaS products, so everything works as one complete product."
      />

      <section aria-labelledby="services-list" className="pt-4 pb-8">
        <Container>
          <h2 id="services-list" className="sr-only">
            Services
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <FullStackOverview />

      <section aria-labelledby="process" className="pb-8">
        <Container>
          <SectionHeading
            id="process"
            eyebrow="How we’ll work"
            title="A practical approach"
            description="First understand, then build. Each project moves through three simple stages."
          />
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {process.map(({ title, text }, index) => (
              <li
                key={title}
                className="reveal rounded-3xl border border-line bg-surface p-7 shadow-card"
              >
                <span className="text-gradient text-4xl font-semibold tracking-tight">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-fg">{title}</h3>
                <p className="mt-2 text-[0.95rem] leading-7 text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CallToAction title="Let’s build your project" />
    </>
  );
}
