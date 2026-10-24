import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The speech route reads article Markdown at request time, so ship the content folder with it.
  outputFileTracingIncludes: { "/api/speech": ["./content/**/*"] },
  experimental: {
    // Put the (small, ~12 KiB) stylesheet inside the HTML so the first paint doesn't wait on a separate request.
    inlineCss: true,
  },
  // Keep a running development server from overwriting production build files.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  // Browsers and crawlers ask for /favicon.ico regardless of the page's icon links; serve the one site icon there.
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.png" }];
  },
  // Articles moved from /blog to /insight; keep old links and search results working.
  async redirects() {
    return [
      { source: "/blog", destination: "/insight", permanent: true },
      { source: "/blog/:slug", destination: "/insight/:slug", permanent: true },
      // The property management case study was replaced by the Karobar case study; keep indexed links working.
      { source: "/work/property-management-dashboard", destination: "/work/karobar-app-product-design", permanent: true },
      { source: "/work/bookkeeping-app-redesign-small-business", destination: "/work/karobar-app-product-design", permanent: true },
      // Briz moved to a marketplace-focused slug; keep indexed links working.
      { source: "/work/briz-mobile-workflow", destination: "/work/briz-local-marketplace-app-nepal", permanent: true },
    ];
  },
};

export default nextConfig;
