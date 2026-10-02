import { insightsPath } from "./routes";

/** `section` is the home-page anchor the dock scrolls to; elsewhere the dock links to `href`. */
export const destinations = [
  { href: "/", label: "Home", icon: "home", section: "top" },
  { href: "/work", label: "Projects", icon: "work", section: "work" },
  { href: "/about", label: "About", icon: "about", section: "experience" },
  { href: "/craft", label: "Craft", icon: "craft", section: "craft" },
  { href: insightsPath, label: "Insights", icon: "insights", section: "insights" },
] as const;

export type DestinationIcon = (typeof destinations)[number]["icon"];
