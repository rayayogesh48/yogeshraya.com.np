import Script from "next/script";
import { gaMeasurementId, isPublicSite } from "@/config/site";

/**
 * Google Analytics 4 (gtag.js). Loads after the page is interactive, and only on the public production site so
 * local development, preview deployments, and tests never send visits. GA4's enhanced measurement records the
 * client-side page changes made by Next.js navigation.
 */
export function GoogleAnalytics() {
  if (!isPublicSite) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaMeasurementId)});`}
      </Script>
    </>
  );
}
