import Link from "next/link";
import { FaEnvelope, FaPhone } from "react-icons/fa6";
import { navLinks, site, socialLinks } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-semibold text-ink">{site.name}</p>
          <p className="mt-2 text-sm text-ink-muted">{site.title}</p>
          <p className="mt-4 max-w-xs text-sm text-ink-subtle">
            Building complete web solutions, from user interfaces to backend systems and
            databases.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-sm font-semibold text-ink">Pages</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-muted transition hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold text-ink">Get in touch</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 break-all text-ink-muted transition hover:text-accent"
              >
                <FaEnvelope className="shrink-0 text-accent" aria-hidden />
                {site.email}
              </a>
            </li>
            {site.phones.map((phone) => (
              <li key={phone.href}>
                <a
                  href={phone.href}
                  className="inline-flex items-center gap-2 text-ink-muted transition hover:text-accent"
                >
                  <FaPhone className="shrink-0 text-accent" aria-hidden />
                  {phone.display}
                </a>
              </li>
            ))}
          </ul>
          {socialLinks.length > 0 && (
            <ul className="mt-4 flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-9 place-items-center rounded-lg text-ink-muted ring-1 ring-white/10 transition hover:text-accent hover:ring-accent/40"
                  >
                    <Icon aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-ink-subtle">
        © <CurrentYear /> {site.name}. All rights reserved.
      </div>
    </footer>
  );
}

async function CurrentYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}
