import { insightsPath } from "./routes";

export type DestinationIcon = "home" | "work" | "about" | "craft" | "insights";

/**
 * `section` is the home-page anchor the dock scrolls to while on the home page. Destinations without one
 * (About, Craft) have no home section and always link to their page.
 */
export const destinations: { href: string; label: string; icon: DestinationIcon; section?: string }[] = [
  { href: "/", label: "Home", icon: "home", section: "top" },
  { href: "/work", label: "Projects", icon: "work", section: "work" },
  { href: "/about", label: "About", icon: "about" },
  { href: "/craft", label: "Craft", icon: "craft" },
  { href: insightsPath, label: "Insights", icon: "insights", section: "insights" },
];
