import Script from "next/script";
import { gaMeasurementId, isPublicSite } from "@/config/site";

/**
 * Google Analytics 4 (gtag.js). Loads once the browser is idle after page load (it is ~175 KiB, so it should not
 * compete with the page itself), and only on the public production site so
 * local development, preview deployments, and tests never send visits. GA4's enhanced measurement records the
 * client-side page changes made by Next.js navigation.
 */
export function GoogleAnalytics() {
  if (!isPublicSite) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="lazyOnload" />
      <Script id="google-analytics" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaMeasurementId)});`}
      </Script>
    </>
  );
}
