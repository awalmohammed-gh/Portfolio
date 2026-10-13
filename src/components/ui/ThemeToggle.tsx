"use client";

import { LuMoon, LuSun } from "react-icons/lu";

/**
 * Switches between light and dark. The current theme lives on
 * <html data-theme>, set before paint by the script in the root layout,
 * so the icons are swapped in CSS and no client state is needed.
 */
export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode); the switch still applies.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className="grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg"
    >
      <LuMoon aria-hidden="true" className="theme-moon size-[18px]" />
      <LuSun aria-hidden="true" className="theme-sun size-[18px]" />
    </button>
  );
}
