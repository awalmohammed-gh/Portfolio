"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { LuArrowUpRight, LuMenu, LuX } from "react-icons/lu";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { navLinks, site } from "@/data/site";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pageLinks = navLinks.filter((link) => link.href !== "/contact");

  return (
    <header
      className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-xl"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-18 w-full max-w-330 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center rounded-lg"
          aria-label={`${site.name}, home`}
        >
          <Logo />
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

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/contact"
            className="group ml-1 hidden h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-accent-fg transition hover:bg-accent-hover sm:inline-flex"
          >
            Let’s talk
            <LuArrowUpRight
              aria-hidden="true"
              className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="grid size-10 place-items-center rounded-full text-fg transition hover:bg-surface-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <LuX aria-hidden="true" className="size-5" />
            ) : (
              <LuMenu aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-surface md:hidden">
          <ul className="mx-auto max-w-330 px-2 py-2 sm:px-4">
            {navLinks.map(({ href, label }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition ${
                      active ? "bg-accent-soft text-accent" : "text-fg hover:bg-surface-2"
                    }`}
                  >
                    {label}
                    <LuArrowUpRight aria-hidden="true" className="size-4 text-subtle" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
