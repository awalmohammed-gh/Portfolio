"use client";

import { LuMoon, LuSun } from "react-icons/lu";

/**
 * Switches between light and dark. The current theme lives on
 * <html data-theme>, set before paint by the script in the root layout,
 * so the icons are swapped in CSS and no client state is needed. The choice
 * is remembered in a small first-party preference cookie.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className={`grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg ${className}`}
    >
      <LuMoon aria-hidden="true" className="theme-moon size-[18px]" />
      <LuSun aria-hidden="true" className="theme-sun size-[18px]" />
    </button>
  );
}
