import type { Metadata } from "next";
import { FaDatabase, FaLaptopCode, FaServer } from "react-icons/fa6";
import ServiceCard from "@/components/services/ServiceCard";
import CallToAction from "@/components/ui/CallToAction";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website development, full-stack web applications, e-commerce systems, custom management systems, dashboards, and website redesign.",
};

const deliverables = [
  {
    icon: FaLaptopCode,
    title: "Frontend",
    text: "Responsive interfaces with React, Next.js, TypeScript and Tailwind CSS.",
  },
  {
    icon: FaServer,
    title: "Backend",
    text: "Node.js and Express.js servers, REST APIs, authentication and authorization.",
  },
  {
    icon: FaDatabase,
    title: "Database",
    text: "MongoDB and Mongoose data models designed around your business.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Frontend interfaces and backend systems for your project"
        description="I build both what your users see and the systems behind it, so your website or application works as one complete product."
      />

      <section aria-labelledby="full-stack" className="border-b border-white/5 bg-navy-900/40 py-14">
        <Container>
          <h2 id="full-stack" className="sr-only">
            What full-stack delivery covers
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {deliverables.map(({ icon: Icon, title, text }) => (
              <li key={title} className="reveal flex gap-4 rounded-2xl p-2">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                  <Icon aria-hidden className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="services-list" className="py-20">
        <Container>
          <SectionHeading
            id="services-list"
            eyebrow="What I offer"
            title="Services"
            description="Pick a single service or combine them. Every build can include the frontend, backend, and database it needs."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} detailed />
            ))}
          </div>
        </Container>
      </section>

      <CallToAction title="Let's build your project" />
    </>
  );
}
