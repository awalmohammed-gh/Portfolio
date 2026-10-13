"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuArrowUpRight } from "react-icons/lu";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { navLinks, site } from "@/data/site";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Top bar. On phones, page navigation moves to the bottom tab bar (MobileTabBar). */
export default function Navbar() {
  const pathname = usePathname();
  const pageLinks = navLinks.filter((link) => link.href !== "/contact");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-330 items-center justify-between gap-3 px-4 sm:h-18 sm:px-6 lg:px-8"
      >
        <Link href="/" className="flex min-w-0 items-center rounded-lg" aria-label={`${site.name}, home`}>
          <Logo className="truncate" />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {pageLinks.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-surface-2 text-fg"
                      : "text-muted hover:bg-surface-2 hover:text-fg"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <Link
            href="/contact"
            className="group ml-2 hidden h-11 items-center gap-2 rounded-full bg-accent px-5 text-[0.95rem] font-medium text-accent-fg shadow-[0_8px_24px_-10px] shadow-accent/60 transition hover:bg-accent-hover md:inline-flex"
          >
            Let’s talk
            <LuArrowUpRight
              aria-hidden="true"
              className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
}
