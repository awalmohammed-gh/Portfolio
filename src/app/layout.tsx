import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteSettings } from "@/lib/data/public";
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
    openGraph: {
      title,
      description,
      type: "website",
      siteName: settings.siteName,
      ...(ogImage
        ? { images: [{ url: ogImage.url, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }] }
        : {}),
    },
    icons: { icon: settings.favicon?.url || "/icon.svg" },
  };
}

export const viewport: Viewport = {
  // Lets the mobile tab bar extend under the iPhone home indicator (padded via safe-area insets).
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#08080c" },
  ],
};

// Applies the saved (cookie) or system theme before first paint to avoid a flash.
const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(light|dark)/);var t=m?m[1]:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* Browser extensions (e.g. Grammarly) add attributes to <body> before React hydrates. */}
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
