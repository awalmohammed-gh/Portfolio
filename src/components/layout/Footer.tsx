import Link from "next/link";
import { LuArrowUp, LuMail, LuPhone } from "react-icons/lu";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import { navLinks, site, socialLinks } from "@/data/site";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center rounded-lg" aria-label={`${site.name}, home`}>
              <Logo />
            </Link>
            <p className="mt-4 max-w-xs text-[0.95rem] leading-7 text-muted">
              {site.title}. Building SaaS products and complete full-stack systems, from
              user interfaces to backend services and databases.
            </p>
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
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2.5 break-all text-muted transition hover:text-accent"
                >
                  <LuMail aria-hidden="true" className="size-4 shrink-0 text-accent" />
                  {site.email}
                </a>
              </li>
              {site.phones.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="inline-flex items-center gap-2.5 text-muted transition hover:text-accent"
                  >
                    <LuPhone aria-hidden="true" className="size-4 shrink-0 text-accent" />
                    {phone.display}
                  </a>
                </li>
              ))}
            </ul>
            {socialLinks.length > 0 && (
              <ul className="mt-5 flex gap-2">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (opens in a new tab)`}
                      className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-line-strong hover:text-fg"
                    >
                      <Icon aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-subtle">
          <p>
            © <CurrentYear /> {site.name}. All rights reserved.
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
