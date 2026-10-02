import { aboutData } from "@site/profile";
import { TopNav } from "./top-nav.client";
import { Dock } from "./dock.client";
import { ScrollProgress } from "./scroll-progress.client";

const contactHref = aboutData.email
  ? `mailto:${aboutData.email}`
  : (aboutData.socials.linkedin ?? "/about#contact");

export function Navbar() {
  return (
    <>
      <ScrollProgress />
      <TopNav contactHref={contactHref} resume={aboutData.resume} />
    </>
  );
}

export function SiteDock() {
  return <Dock contactHref={contactHref} />;
}
