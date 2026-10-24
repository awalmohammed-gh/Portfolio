"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuArrowUpRight } from "react-icons/lu";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import InstallPWAButton from "@/components/pwa/InstallPWAButton";
import { navLinks } from "@/lib/navigation";
import type { ImageAsset } from "@/types/media";
import styles from "./Navbar.module.css";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Floating public navigation with a centered desktop link group. */
export default function Navbar({ siteName, logo }: { siteName: string; logo?: ImageAsset }) {
  const pathname = usePathname();
  const pageLinks = navLinks.filter((link) => link.href !== "/contact");

  return (
    <header className={`${styles.header} sticky top-[calc(0.75rem+env(safe-area-inset-top))] z-50 mx-3 mt-[calc(0.75rem+env(safe-area-inset-top))] mb-3 rounded-full border border-line bg-surface/85 shadow-card backdrop-blur-xl`}>
      <nav
        aria-label="Primary"
        className={`${styles.nav} mx-auto flex h-14 w-full max-w-330 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6`}
      >
        <Link href="/" className="flex min-w-0 flex-col items-start justify-center gap-0.5 justify-self-start rounded-lg" aria-label={`${siteName}, home`}>
          <Logo name={siteName} image={logo} className="max-w-full truncate object-contain" />
          <span className="hidden text-[0.6rem] font-medium tracking-[0.16em] text-subtle uppercase lg:block">Portfolio &amp; selected work</span>
        </Link>

        <ul className="hidden items-center gap-0.5 rounded-full border border-line bg-surface-2/60 p-1 md:flex">
          {pageLinks.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center justify-center rounded-full border px-3 py-2 text-[0.8rem] font-medium transition lg:px-4 lg:text-sm ${
                    active
                      ? "border-line bg-surface text-accent shadow-sm"
                      : "border-transparent text-muted hover:bg-surface hover:text-fg"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1 justify-self-end md:gap-2 lg:gap-3">
          <InstallPWAButton />
          <ThemeToggle className="md:border md:border-line md:bg-surface/70" />
          <span aria-hidden="true" className="hidden h-5 w-px bg-line lg:block" />
          <Link
            href="/contact"
            aria-current={isActive(pathname, "/contact") ? "page" : undefined}
            className="group hidden h-11 items-center gap-2 rounded-full bg-accent py-1 pr-1.5 pl-4 text-[0.8rem] font-medium whitespace-nowrap text-accent-fg shadow-[0_8px_24px_-10px] shadow-accent/60 transition hover:bg-accent-hover md:inline-flex lg:pl-5 lg:text-sm"
          >
            Let’s talk
            <span className="grid size-8 place-items-center rounded-full bg-accent-fg/15"><LuArrowUpRight
              aria-hidden="true"
              className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            /></span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
