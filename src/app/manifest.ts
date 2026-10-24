import type { MetadataRoute } from "next";
import { siteDescription, siteName } from "@/config/site";

/** Lets the site be added to a phone's home screen, using the same single icon as the favicon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteName} · Product Designer`,
    short_name: siteName,
    description: siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#111111",
    theme_color: "#111111",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
    ],
  };
}
