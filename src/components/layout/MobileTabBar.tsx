"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import { LuBriefcase, LuFolderKanban, LuHouse, LuMessageCircle, LuUserRound } from "react-icons/lu";
import { navLinks } from "@/data/site";

const icons: Record<string, IconType> = {
  "/": LuHouse,
  "/about": LuUserRound,
  "/projects": LuFolderKanban,
  "/services": LuBriefcase,
  "/contact": LuMessageCircle,
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Floating app-style tab bar for phones (hidden from md up). The active tab
 * gets a pill behind its icon, similar to WhatsApp / Material 3 navigation.
 */
export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md rounded-[1.75rem] border border-line bg-surface/85 px-1.5 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.35)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid grid-cols-5">
        {navLinks.map(({ href, label }) => {
          const Icon = icons[href] ?? LuHouse;
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="group flex flex-col items-center gap-1 px-1 pt-2.5 pb-2"
              >
                <span className="relative grid h-8 w-14 place-items-center">
                  <span
                    className={`absolute inset-0 rounded-full bg-accent-soft transition duration-300 ease-out ${
                      active ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    }`}
                    aria-hidden="true"
                  />
                  <Icon
                    aria-hidden="true"
                    className={`relative size-5 transition-colors ${
                      active ? "text-accent" : "text-muted group-hover:text-fg"
                    }`}
                  />
                </span>
                <span
                  className={`text-xs transition-colors ${
                    active ? "font-semibold text-fg" : "font-medium text-muted"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
