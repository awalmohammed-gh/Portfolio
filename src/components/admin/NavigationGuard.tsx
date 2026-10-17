"use client";

import { createContext, use, useCallback, useEffect, useId, useMemo, useRef, type ReactNode } from "react";
import { useConfirm } from "./Feedback";

type Guard = { mark: (id: string, dirty: boolean) => void; canLeave: () => Promise<boolean> };
const Context = createContext<Guard | null>(null);

export function useNavigationGuard() {
  const context = use(Context);
  if (!context) throw new Error("NavigationGuard is missing");
  return context;
}

export function useUnsavedChanges(dirty: boolean) {
  const { mark } = useNavigationGuard();
  const id = useId();
  useEffect(() => {
    mark(id, dirty);
    return () => mark(id, false);
  }, [dirty, id, mark]);
}

/** Protects links throughout the workspace, including server-rendered breadcrumbs. */
export default function NavigationGuard({ children }: { children: ReactNode }) {
  const confirm = useConfirm();
  const forms = useRef(new Set<string>());
  const bypass = useRef(false);
  const pending = useRef(false);
  const mark = useCallback((id: string, dirty: boolean) => {
    if (dirty) forms.current.add(id);
    else forms.current.delete(id);
  }, []);
  const canLeave = useCallback(async () => !forms.current.size || confirm({
    title: "Leave without saving?",
    message: "Your unsaved edits will be lost. Stay on this page to save them first.",
    confirmLabel: "Discard changes",
    cancelLabel: "Keep editing",
  }), [confirm]);
  const value = useMemo(() => ({ mark, canLeave }), [mark, canLeave]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (forms.current.size) event.preventDefault();
    };
    const onClick = (event: MouseEvent) => {
      if (bypass.current || !forms.current.size || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;
      event.preventDefault();
      event.stopPropagation();
      if (pending.current) return;
      pending.current = true;
      void canLeave().then((allowed) => {
        if (allowed) {
          forms.current.clear();
          bypass.current = true;
          link.click();
          bypass.current = false;
        }
      }).finally(() => { pending.current = false; });
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [canLeave]);

  return <Context value={value}>{children}</Context>;
}
