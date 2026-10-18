import { ArrowUpRight, Download } from "lucide-react";
import { aboutData, personal } from "@site/profile";
import { AboutMeSection } from "./about-me-section.client";
import { ExperienceSection } from "./experience-section.client";
import { StrengthsSection } from "./strengths-section.client";
import { LogoStrip } from "./logo-strip";
import { CopyEmail } from "@/components/site/copy-email.client";
import { BrandIcon } from "@/components/ui/brand-icons";

export function AboutPage() {
  return (
    <div className="page-width subpage">
      <AboutMeSection />
      <ExperienceSection />
      <LogoStrip />
      <StrengthsSection />

      <section className="home-section" aria-labelledby="tools-heading">
        <h2 className="heading-section" id="tools-heading">
          Tools I Use
        </h2>
        <ul className="tool-list">
          {personal.tools.map((tool) => (
            <li key={tool.name}>
              <span className="tool-name">
                <span className="tool-icon">
                  <BrandIcon name={tool.icon} />
                </span>
                {tool.name}
              </span>
              <span className="tool-use">{tool.use}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section" aria-labelledby="philosophy-heading">
        <h2 className="heading-section" id="philosophy-heading">
          Design Philosophy
        </h2>
        <blockquote className="philosophy">{personal.philosophy}</blockquote>
      </section>

      <section className="section contact-section" id="contact">
        <h2>
          Have a product problem
          <br />
          worth solving? Let’s talk.
        </h2>
        <div className="actions">
          {aboutData.email ? (
            <>
              <a className="button primary" href={`mailto:${aboutData.email}`}>
                Get in touch
                <ArrowUpRight size={16} />
              </a>
              <CopyEmail />
            </>
          ) : (
            <a className="button primary" href={aboutData.socials.linkedin} target="_blank" rel="noopener noreferrer">
              Connect on LinkedIn
              <ArrowUpRight size={16} />
            </a>
          )}
          {aboutData.resume && (
            <a className="button secondary" href={aboutData.resume} download>
              Download CV
              <Download size={16} />
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
