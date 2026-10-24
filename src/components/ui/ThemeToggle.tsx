"use client";

import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

function updateThemeColorMeta(theme: "light" | "dark") {
  const color = theme === "dark" ? "#08080c" : "#f7f7f9";
  const metas = document.querySelectorAll('meta[name="theme-color"]');
  metas.forEach((meta) => {
    meta.setAttribute("content", color);
  });
}

/**
 * Manages theme selection:
 * - Adapts to the system theme by default in real-time.
 * - Unless the user explicitly changes it (saved in a first-party cookie).
 * - Double-clicking the toggle resets back to automatic system theme sync.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [hasManualOverride, setHasManualOverride] = useState(false);

  useEffect(() => {
    const checkOverride = () => {
      const match = document.cookie.match(/(?:^|; )theme=(light|dark)/);
      setHasManualOverride(Boolean(match));
    };
    checkOverride();

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      // Only adapt to system theme if the user hasn't manually overridden it
      const match = document.cookie.match(/(?:^|; )theme=(light|dark)/);
      if (!match) {
        const systemTheme = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", systemTheme);
        updateThemeColorMeta(systemTheme);
      }
    };

    mq.addEventListener("change", handleSystemChange);
    return () => mq.removeEventListener("change", handleSystemChange);
  }, []);

  function toggle() {
    const root = document.documentElement;
    const currentTheme =
      root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const nextTheme: "light" | "dark" = currentTheme === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", nextTheme);
    document.cookie = `theme=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
    setHasManualOverride(true);
    updateThemeColorMeta(nextTheme);
  }

  function handleDoubleClick(e: React.MouseEvent) {
    e.preventDefault();
    // Clear manual override and adapt back to system theme
    document.cookie = "theme=; path=/; max-age=0; samesite=lax";
    setHasManualOverride(false);
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    document.documentElement.setAttribute("data-theme", systemTheme);
    updateThemeColorMeta(systemTheme);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      onDoubleClick={handleDoubleClick}
      aria-label="Switch between light and dark theme (double-click to follow system)"
      title={
        hasManualOverride
          ? "Switch theme (manually set). Double-click to follow system."
          : "Theme adapts to system. Click to switch theme manually."
      }
      className={`grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg ${className}`}
    >
      <LuMoon aria-hidden="true" className="theme-moon size-[18px]" />
      <LuSun aria-hidden="true" className="theme-sun size-[18px]" />
    </button>
  );
}
