import type { ReactNode } from "react";
import { getSiteSettings } from "@/lib/data/public";
import Footer from "./Footer";
import MobileTabBar from "./MobileTabBar";
import Navbar from "./Navbar";
import SmoothScroll from "./SmoothScroll";
import styles from "./PortfolioShell.module.css";

/** Public site chrome: skip link, navigation, footer and the mobile tab bar. */
export default async function PortfolioShell({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div data-public-shell className={`${styles.shell} flex min-h-full flex-1 flex-col pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pb-0`}>
      <div data-page-backdrop="glow" aria-hidden="true" className={`${styles.backdrop} bg-glow`} />
      <div data-page-backdrop="pattern" aria-hidden="true" className={`${styles.backdrop} bg-dots`} />
      <a
        href="#main"
        className="fixed top-3 left-3 z-100 -translate-y-24 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition focus:translate-y-0"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <Navbar siteName={settings.siteName} logo={settings.logo ?? undefined} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
