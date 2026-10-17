import FullStackOverview from "@/components/home/FullStackOverview";
import ServiceCard from "@/components/services/ServiceCard";
import CallToAction from "@/components/ui/CallToAction";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import { getContent, getServices } from "@/lib/data/public";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const copy = await getContent("services");
  return pageMetadata("/services", copy.seo);
}

export default async function ServicesPage() {
  const [services, copy] = await Promise.all([getServices(), getContent("services")]);
  const { process } = copy;

  return (
    <>
      <PageHeader
        eyebrow={copy.header.eyebrow}
        title={
          <>
            {copy.header.title.lead} <span className="text-gradient">{copy.header.title.highlight}</span>
          </>
        }
        description={copy.header.description}
      />

      <section aria-labelledby="services-list" className="pt-4 pb-8">
        <Container>
          <h2 id="services-list" className="sr-only">
            Services
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <FullStackOverview />

      {process.steps.length > 0 && (
        <section aria-labelledby="process" className="pb-8">
          <Container>
            <SectionHeading
              id="process"
              eyebrow={process.eyebrow}
              title={process.title}
              description={process.description}
            />
            <ol className="mt-12 grid gap-4 md:grid-cols-3">
              {process.steps.map(({ title, text }, index) => (
                <li
                  key={`${title}-${index}`}
                  className="reveal rounded-3xl border border-line bg-surface p-7 shadow-card"
                >
                  <span className="text-gradient text-4xl font-semibold tracking-tight">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-fg">{title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-7 text-muted">{text}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      <CallToAction title={copy.cta.title || undefined} description={copy.cta.description || undefined} />
    </>
  );
}
