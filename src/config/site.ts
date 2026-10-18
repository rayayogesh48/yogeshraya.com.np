import { aboutData } from "@site/profile";

export const siteName = aboutData.name;
export const siteDescription =
  `Product design, clear user flows, and thoughtful interfaces. The work and insights of ${siteName}, a product designer based in Nepal.`;

const suppliedOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const deployment = process.env.VERCEL_ENV;

function validateOrigin(origin: string | undefined) {
  if (!origin) {
    if (deployment === "production") throw new Error("NEXT_PUBLIC_SITE_URL is required for production deployment");
    return undefined;
  }
  let url: URL;
  try { url = new URL(origin); } catch { throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute URL"); }
  if (url.origin !== origin || (deployment === "production" && url.protocol !== "https:")) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an origin; production requires HTTPS");
  }
  return origin;
}

export const siteUrl = validateOrigin(suppliedOrigin);
export const isPublicSite = deployment === "production" && Boolean(siteUrl);

/** Google Analytics 4 measurement ID; override with NEXT_PUBLIC_GA_MEASUREMENT_ID. Only used on the public site. */
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-EBNBQG6GZ8";
if (!/^G-[A-Z0-9]+$/.test(measurementId)) throw new Error("NEXT_PUBLIC_GA_MEASUREMENT_ID must look like G-XXXXXXXXXX");
export const gaMeasurementId = measurementId;
