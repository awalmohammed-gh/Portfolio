"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Portaled tooltips stay visible outside the independently scrolling sidebar. */
export default function AdminTooltip({ label, enabled, children }: {
  label: string;
  enabled: boolean;
  children: (descriptionId: string | undefined) => ReactNode;
}) {
  const id = useId();
  const target = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<{ left?: number; right?: number; top: number } | null>(null);
  const show = () => {
    if (!enabled || !target.current) return;
    const rect = target.current.getBoundingClientRect();
    setPosition({
      ...(window.innerWidth - rect.right > 200 ? { left: rect.right + 12 } : { right: window.innerWidth - rect.left + 12 }),
      top: Math.min(window.innerHeight - 20, Math.max(20, rect.top + rect.height / 2)),
    });
  };
  const visible = enabled && position !== null;
  useEffect(() => {
    if (!visible) return;
    const hide = () => setPosition(null);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") hide(); };
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
      document.removeEventListener("keydown", onKey);
    };
  }, [visible]);
  return <span ref={target} className="admin-tooltip-target" onPointerEnter={show} onPointerLeave={() => setPosition(null)} onFocusCapture={show} onBlurCapture={() => setPosition(null)}>
    {children(visible ? id : undefined)}
    {visible && createPortal(<span id={id} role="tooltip" className="admin-nav-tooltip" style={position}>{label}</span>, document.body)}
  </span>;
}
