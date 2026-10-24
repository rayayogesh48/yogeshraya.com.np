"use client";

import { aboutData } from "@site/profile";
import { Reveal } from "@/components/motion/portfolio-motion.client";
import { useLocalStatus } from "./local-time.client";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** A big closing line with my profile links underneath. The dot follows my local time; pages live in the dock. */
export function Footer() {
  const { email, socials, name, timeZone } = aboutData;
  const now = useLocalStatus(timeZone);
  const links = [
    email && { href: `mailto:${email}`, label: "Email", aria: `Email ${name}` },
    socials.linkedin && { href: socials.linkedin, label: "LinkedIn", aria: `${name} on LinkedIn` },
    socials.twitter && { href: socials.twitter, label: "X", aria: `${name} on X` },
    socials.dribbble && { href: socials.dribbble, label: "Dribbble", aria: `${name} on Dribbble` },
    socials.github && { href: socials.github, label: "GitHub", aria: `${name} on GitHub` },
  ].filter((item): item is { href: string; label: string; aria: string } => Boolean(item));

  return (
    <Reveal as="footer" className="footer page-width">
      <p className="foot-eyebrow">
        <span className="foot-status-dot" data-tone={now?.tone ?? "on"} aria-hidden="true" />
        Got a project or a role?
      </p>
      <h2 className="foot-headline">Let’s build something real.</h2>
      <ul className="foot-links">
        {links.map((item) => (
          <li key={item.label}>
            <a href={item.href} aria-label={item.aria} {...(item.href.startsWith("http") ? external : {})}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
