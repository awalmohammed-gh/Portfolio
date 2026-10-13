"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Eased wheel/trackpad scrolling via Lenis. Touch devices keep native
 * scrolling, and it stays off when the visitor prefers reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      // Smoothly scroll in-page #links, clearing the sticky header.
      anchors: { offset: -88 },
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
