import { FaArrowRight } from "react-icons/fa6";
import ServiceCard from "@/components/services/ServiceCard";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/data/services";

export default function ServicesPreview() {
  return (
    <section aria-labelledby="services-preview" className="border-t border-white/5 bg-navy-900/40 py-20">
      <Container>
        <SectionHeading
          id="services-preview"
          eyebrow="Services"
          title="How I can help"
          description="From a single website to a complete web application with its own backend and database."
          align="center"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/services" variant="secondary">
            Explore services <FaArrowRight aria-hidden className="size-3" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
