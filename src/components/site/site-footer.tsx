"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { aboutData } from "@site/profile";
import { Reveal } from "@/components/motion/portfolio-motion.client";
import { GitHubIcon, LinkedInIcon, MailIcon, PinIcon, XIcon } from "@/components/ui/icons";
import { LocalTime } from "./local-time.client";

function Social({ href, label, tip, children }: { href: string; label: string; tip: string; children: ReactNode }) {
  return (
    <motion.a
      className="social"
      href={href}
      aria-label={label}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
    >
      <motion.span variants={{ rest: { y: 0 }, hover: { y: -2 } }}>{children}</motion.span>
      <motion.span
        className="social-tip"
        aria-hidden="true"
        variants={{ rest: { opacity: 0, y: 4, scale: 0.95 }, hover: { opacity: 1, y: 0, scale: 1 } }}
        transition={{ duration: 0.18 }}
      >
        {tip}
      </motion.span>
    </motion.a>
  );
}

export function Footer() {
  const { email, socials, name, country, timeZone } = aboutData;
  return (
    <Reveal as="footer" className="footer page-width">
      <div className="foot-row">
        <span className="foot-loc">
          <PinIcon size={13} /> Based in {country}, designing worldwide
        </span>
        <LocalTime timeZone={timeZone} place={country} />
      </div>
      <div className="foot-row foot-row--bottom">
        <span>
          © {new Date().getFullYear()} {name}
        </span>
        <div className="socials">
          {email && (
            <Social href={`mailto:${email}`} label={`Email ${name}`} tip="say hello">
              <MailIcon size={15} />
            </Social>
          )}
          {socials.linkedin && (
            <Social href={socials.linkedin} label={`${name} on LinkedIn`} tip="let's connect">
              <LinkedInIcon size={14} />
            </Social>
          )}
          {socials.twitter && (
            <Social href={socials.twitter} label={`${name} on X`} tip="thoughts, mostly">
              <XIcon size={13} />
            </Social>
          )}
          {socials.github && (
            <Social href={socials.github} label={`${name} on GitHub`} tip="see my code">
              <GitHubIcon size={15} />
            </Social>
          )}
        </div>
      </div>
    </Reveal>
  );
}
