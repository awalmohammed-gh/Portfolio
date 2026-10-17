import { LuMail, LuMessageSquare, LuPhone } from "react-icons/lu";
import ContactForm from "@/components/contact/ContactForm";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import PageHeader from "@/components/ui/PageHeader";
import { getContent, getServices, getSiteSettings } from "@/lib/data/public";
import { telHref } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const copy = await getContent("contact");
  return pageMetadata("/contact", copy.seo);
}

const card = "reveal rounded-3xl border border-line bg-surface p-6 shadow-card";
const iconTile = "grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent";

export default async function ContactPage() {
  const [copy, settings, services] = await Promise.all([
    getContent("contact"),
    getSiteSettings(),
    getServices(),
  ]);
  const showForm = settings.contactFormEnabled && Boolean(settings.email);

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

      <section aria-label="Contact details and form" className="pb-16 sm:pb-24">
        <Container className="grid items-start gap-6 lg:grid-cols-12">
          <div className={`space-y-4 ${showForm ? "lg:col-span-5" : "lg:col-span-7"}`}>
            {settings.email && (
              <a href={`mailto:${settings.email}`} className={`${card} group flex items-center gap-4 transition hover:border-line-strong`}>
                <span className={iconTile}>
                  <LuMail aria-hidden="true" className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-muted">Email</span>
                  <span className="block font-medium break-all text-fg group-hover:text-accent">
                    {settings.email}
                  </span>
                </span>
              </a>
            )}

            {settings.phones.length > 0 && (
              <div className={`${card} flex items-start gap-4`}>
                <span className={iconTile}>
                  <LuPhone aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-muted">Phone</p>
                  <ul className="mt-0.5 space-y-1">
                    {settings.phones.map((phone) => (
                      <li key={phone.number}>
                        <a href={telHref(phone.number)} className="font-medium text-fg hover:text-accent">
                          {phone.display}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {(copy.note.title || copy.note.text) && (
              <div className={`${card} flex items-start gap-4`}>
                <span className={iconTile}>
                  <LuMessageSquare aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="font-medium text-fg">{copy.note.title}</p>
                  <p className="mt-1 text-[0.95rem] leading-7 text-muted">{copy.note.text}</p>
                </div>
              </div>
            )}

            {settings.socialLinks.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {settings.socialLinks.map(({ label, url, icon }) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm text-fg transition hover:border-line-strong"
                    >
                      <Icon name={icon} aria-hidden="true" />
                      {label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {showForm && (
            <div className="lg:col-span-7">
              <ContactForm
                email={settings.email}
                serviceTitles={services.map((service) => service.title)}
                copy={copy.form}
              />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
