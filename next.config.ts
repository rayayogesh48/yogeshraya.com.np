import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep a running development server from overwriting production build files.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  // Articles moved from /blog to /insight; keep old links and search results working.
  async redirects() {
    return [
      { source: "/blog", destination: "/insight", permanent: true },
      { source: "/blog/:slug", destination: "/insight/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
