import Link from "next/link";
import { LuArrowUp, LuMail, LuPhone } from "react-icons/lu";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { getContent, getSiteSettings } from "@/lib/data/public";
import { telHref } from "@/lib/format";
import { navLinks } from "@/lib/navigation";

export default async function Footer() {
  const [settings, footer] = await Promise.all([getSiteSettings(), getContent("footer")]);

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center rounded-lg" aria-label={`${settings.siteName}, home`}>
              <Logo name={settings.siteName} image={settings.logo ?? undefined} />
            </Link>
            {footer.tagline && (
              <p className="mt-4 max-w-xs text-[0.95rem] leading-7 text-muted">{footer.tagline}</p>
            )}
          </div>

          <nav aria-label="Footer">
            <p className="text-sm font-semibold text-fg">Pages</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.95rem]">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-muted transition hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold text-fg">Get in touch</p>
            <ul className="mt-4 space-y-3 text-[0.95rem]">
              {settings.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="inline-flex items-center gap-2.5 break-all text-muted transition hover:text-accent"
                  >
                    <LuMail aria-hidden="true" className="size-4 shrink-0 text-accent" />
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phones.map((phone) => (
                <li key={phone.number}>
                  <a
                    href={telHref(phone.number)}
                    className="inline-flex items-center gap-2.5 text-muted transition hover:text-accent"
                  >
                    <LuPhone aria-hidden="true" className="size-4 shrink-0 text-accent" />
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
            {settings.socialLinks.length > 0 && (
              <ul className="mt-5 flex gap-2">
                {settings.socialLinks.map(({ label, url, icon }) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (opens in a new tab)`}
                      className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-line-strong hover:text-fg"
                    >
                      <Icon name={icon} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-subtle">
          <p>
            © <CurrentYear /> {settings.siteName}. All rights reserved.
          </p>
          <a
            href="#main"
            className="inline-flex items-center gap-2 rounded-full transition hover:text-fg"
          >
            Back to top
            <LuArrowUp aria-hidden="true" className="size-4" />
          </a>
        </div>
      </Container>
    </footer>
  );
}

async function CurrentYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}
