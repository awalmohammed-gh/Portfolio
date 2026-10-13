import type { Metadata } from "next";
import { FaEnvelope, FaLayerGroup, FaPhone } from "react-icons/fa6";
import ContactForm from "@/components/contact/ContactForm";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import { site, socialLinks } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Mohammed Awal about websites, web applications, and full-stack projects.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's work together"
        description="Tell me about your website, web application, or system idea, and I'll get back to you."
      />

      <section className="py-20">
        <Container className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <a
              href={`mailto:${site.email}`}
              className="reveal flex items-start gap-4 rounded-2xl bg-navy-900/70 p-5 ring-1 ring-white/5 transition hover:ring-accent/30"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                <FaEnvelope aria-hidden className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-ink-subtle">Email</span>
                <span className="mt-0.5 block font-medium break-all text-ink">{site.email}</span>
              </span>
            </a>

            <div className="reveal flex items-start gap-4 rounded-2xl bg-navy-900/70 p-5 ring-1 ring-white/5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                <FaPhone aria-hidden className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-ink-subtle">Phone</p>
                <ul className="mt-0.5 space-y-1">
                  {site.phones.map((phone) => (
                    <li key={phone.href}>
                      <a
                        href={phone.href}
                        className="font-medium text-ink transition hover:text-accent"
                      >
                        {phone.display}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="reveal rounded-2xl bg-navy-900/70 p-5 ring-1 ring-white/5">
              <p className="flex items-center gap-2 font-semibold text-ink">
                <FaLayerGroup aria-hidden className="text-accent" />
                What I can help with
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Websites, full-stack web applications, e-commerce systems, management systems,
                dashboards and admin panels, and website redesigns.
              </p>
            </div>

            {socialLinks.length > 0 && (
              <ul className="reveal flex gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-ink-muted ring-1 ring-white/10 transition hover:text-accent hover:ring-accent/40"
                    >
                      <Icon aria-hidden />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
