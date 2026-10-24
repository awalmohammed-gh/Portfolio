import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteSettings } from "@/lib/data/public";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.seoTitle || [settings.siteName, settings.jobTitle].filter(Boolean).join(" | ");
  const description = settings.seoDescription || settings.siteDescription;
  const ogImage = settings.ogImage;

  return {
    ...(settings.canonicalUrl ? { metadataBase: new URL(settings.canonicalUrl) } : {}),
    title: {
      default: title,
      template: `%s | ${settings.siteName}`,
    },
    description,
    keywords: settings.keywords,
    authors: [{ name: settings.siteName }],
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: settings.siteName,
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: settings.siteName,
      ...(ogImage
        ? { images: [{ url: ogImage.url, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }] }
        : {}),
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#08080c" },
  ],
};

// Adapts to the system theme dynamically before first paint, unless the user has explicitly changed it.
const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(light|dark)/);if(m){document.documentElement.setAttribute("data-theme",m[1])}else{var mq=window.matchMedia("(prefers-color-scheme: dark)");var s=function(e){if(!document.cookie.match(/(?:^|; )theme=(light|dark)/)){var d=(e&&e.matches!==undefined)?e.matches:mq.matches;document.documentElement.setAttribute("data-theme",d?"dark":"light")}};s(mq);if(mq.addEventListener){mq.addEventListener("change",s)}else if(mq.addListener){mq.addListener(s)}}}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mohammed Awal" />
        <meta name="application-name" content="Mohammed Awal" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* Browser extensions (e.g. Grammarly) add attributes to <body> before React hydrates. */}
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
