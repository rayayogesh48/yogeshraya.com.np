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
  // Articles moved from /blog to /insight; keep old links and search results working.
  async redirects() {
    return [
      { source: "/blog", destination: "/insight", permanent: true },
      { source: "/blog/:slug", destination: "/insight/:slug", permanent: true },
      // The property management case study was replaced by the Karobar redesign; keep indexed links working.
      { source: "/work/property-management-dashboard", destination: "/work/bookkeeping-app-redesign-small-business", permanent: true },
    ];
  },
};

export default nextConfig;
