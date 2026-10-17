import type { NavLink } from "@/types/content";

/** Site routes. These map to pages in the codebase, so they aren't editable content. */
export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];
