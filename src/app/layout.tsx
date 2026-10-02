import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono, Mukta } from "next/font/google";
import "./globals.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/components.css";
import "@/styles/portfolio.css";
import { Navbar, SiteDock } from "@/components/site/navbar";
import { Footer } from "@/components/site/site-footer";
import { ToastProvider } from "@/components/site/toast.client";
import { PortfolioMotion } from "@/components/motion/portfolio-motion.client";
import { ThemeProvider } from "@/components/theme/theme-provider.client";
import { themeInitScript } from "@/components/theme/theme-init";
import { isPublicSite, siteDescription, siteName, siteUrl } from "@/config/site";
import { aboutData } from "@site/profile";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter-tight",
  display: "swap",
});
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-jetbrains", display: "swap" });
const mukta = Mukta({ subsets: ["devanagari"], weight: ["500", "700"], variable: "--font-mukta", display: "swap" });

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: `${siteName} | Product Designer in Nepal`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  robots: { index: isPublicSite, follow: isPublicSite },
  icons: { icon: "/icon.svg" },
};

// Entrance animations start hidden; without JavaScript they would never play, so show everything.
const noScriptStyles = `[style*="opacity:0"]{opacity:1!important;transform:none!important;filter:none!important}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${jetbrains.variable} ${mukta.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: noScriptStyles }} />
        </noscript>
      </head>
      <body>
        <ThemeProvider>
          <PortfolioMotion>
            <ToastProvider email={aboutData.email}>
              <a href="#main-content" className="skip-link">
                Skip to content
              </a>
              <Navbar />
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
              <Footer />
              <SiteDock />
            </ToastProvider>
          </PortfolioMotion>
        </ThemeProvider>
      </body>
    </html>
  );
}
