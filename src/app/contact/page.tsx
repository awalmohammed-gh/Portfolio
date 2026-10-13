import type { Metadata } from "next";
import { LuMail, LuMessageSquare, LuPhone } from "react-icons/lu";
import ContactForm from "@/components/contact/ContactForm";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import { site, socialLinks } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Mohammed Awal about websites, web applications, and full-stack projects.",
};

const card = "reveal rounded-3xl border border-line bg-surface p-6 shadow-card";
const iconTile = "grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent";

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Let’s build <span className="text-gradient">something together.</span>
          </>
        }
        description="Tell me about your website, SaaS product, web application, or system idea, and I’ll get back to you."
      />

      <section aria-label="Contact details and form" className="pb-16 sm:pb-24">
        <Container className="grid items-start gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <a href={`mailto:${site.email}`} className={`${card} group flex items-center gap-4 transition hover:border-line-strong`}>
              <span className={iconTile}>
                <LuMail aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-muted">Email</span>
                <span className="block font-medium break-all text-fg group-hover:text-accent">
                  {site.email}
                </span>
              </span>
            </a>

            <div className={`${card} flex items-start gap-4`}>
              <span className={iconTile}>
                <LuPhone aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted">Phone</p>
                <ul className="mt-0.5 space-y-1">
                  {site.phones.map((phone) => (
                    <li key={phone.href}>
                      <a href={phone.href} className="font-medium text-fg hover:text-accent">
                        {phone.display}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`${card} flex items-start gap-4`}>
              <span className={iconTile}>
                <LuMessageSquare aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="font-medium text-fg">No finished brief needed</p>
                <p className="mt-1 text-[0.95rem] leading-7 text-muted">
                  A problem to solve or an idea to explore is a good place to start. Websites,
                  SaaS products, web applications, e-commerce, management systems, dashboards, and redesigns.
                </p>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-fg transition hover:border-line-strong"
                    >
                      <Icon aria-hidden="true" />
                      {label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
