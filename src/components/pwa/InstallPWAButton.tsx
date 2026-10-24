"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import {
  LuDownload,
  LuShare,
  LuSquarePlus,
  LuX,
  LuCheck,
  LuSparkles,
} from "react-icons/lu";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Client mount detection to avoid SSR hydration mismatch
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// Standalone mode detection for PWA installed state
function subscribeStandalone(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(display-mode: standalone)");
  mql.addEventListener("change", callback);
  window.addEventListener("appinstalled", callback);
  return () => {
    mql.removeEventListener("change", callback);
    window.removeEventListener("appinstalled", callback);
  };
}

function getStandaloneSnapshot() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function checkIsIosSafari(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isApple = /iphone|ipad|ipod/.test(userAgent);
  const isSafari =
    userAgent.includes("safari") &&
    !userAgent.includes("chrome") &&
    !userAgent.includes("crios") &&
    !userAgent.includes("fxios");
  return isApple && isSafari;
}

export default function InstallPWAButton({ className = "" }: { className?: string }) {
  const isClient = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const isInstalled = useSyncExternalStore(subscribeStandalone, getStandaloneSnapshot, () => false);

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosModal, setShowIosModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const isIos = isClient && !isInstalled && checkIsIosSafari();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 4000);
      console.log("[PWA] Portfolio app successfully installed!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Close iOS modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowIosModal(false);
      }
    };
    if (showIosModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showIosModal]);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 4000);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn("[PWA] Installation prompt error:", err);
    }
  };

  // Don't render anything if SSR, or if already installed (unless just installed feedback)
  if (!isClient) return null;
  if (isInstalled && !justInstalled) return null;

  // If not iOS and no install prompt is available yet, keep hidden until prompt triggers
  if (!deferredPrompt && !isIos && !justInstalled) {
    return null;
  }

  if (justInstalled) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur-md transition-all ${className}`}
      >
        <LuCheck className="size-3.5 text-emerald-400" />
        <span>App Installed!</span>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleInstallClick}
        aria-label="Install Portfolio App"
        title="Install Portfolio App on Desktop or Mobile"
        className={`group relative inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-fg shadow-sm backdrop-blur-md transition-all duration-200 hover:border-accent hover:bg-accent-soft hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
      >
        <span className="relative flex size-2 items-center justify-center">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
        </span>
        <LuDownload
          aria-hidden="true"
          className="size-3.5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:text-accent"
        />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* iOS Safari Installation Instruction Modal / Tooltip */}
      {showIosModal && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Install on iOS Safari"
          className="absolute top-full right-0 z-50 mt-2 w-80 rounded-2xl border border-line bg-surface p-4 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-fg">
              <LuSparkles className="size-4 text-accent" />
              <span>Install Portfolio App</span>
            </div>
            <button
              type="button"
              onClick={() => setShowIosModal(false)}
              aria-label="Close installation instructions"
              className="rounded-full p-1 text-muted hover:bg-surface-2 hover:text-fg"
            >
              <LuX className="size-4" />
            </button>
          </div>

          <p className="mt-2.5 text-xs text-muted leading-relaxed">
            Install this portfolio as a standalone app on your iPhone or iPad for instant offline access:
          </p>

          <ol className="mt-3 space-y-2.5 text-xs text-fg">
            <li className="flex items-start gap-2.5">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface-2 text-[10px] font-bold text-accent">
                1
              </span>
              <span>
                Tap the <strong className="font-semibold text-accent">Share</strong> icon{" "}
                <LuShare className="inline size-3.5 align-middle text-accent" /> in Safari’s toolbar.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface-2 text-[10px] font-bold text-accent">
                2
              </span>
              <span>
                Scroll down and tap{" "}
                <strong className="font-semibold text-fg">Add to Home Screen</strong>{" "}
                <LuSquarePlus className="inline size-3.5 align-middle text-muted" />.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface-2 text-[10px] font-bold text-accent">
                3
              </span>
              <span>
                Tap <strong className="font-semibold text-accent">Add</strong> in the top-right corner.
              </span>
            </li>
          </ol>

          <button
            type="button"
            onClick={() => setShowIosModal(false)}
            className="mt-4 w-full rounded-full bg-accent py-2 text-center text-xs font-semibold text-accent-fg transition hover:bg-accent-hover"
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  );
}
