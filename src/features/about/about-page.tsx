import { ArrowUpRight, Download } from "lucide-react";
import { aboutData, personal } from "@site/profile";
import { experiences } from "@site/experience";
import { StrengthsSection } from "@/features/home/strengths-section.client";
import { CopyEmail } from "@/components/site/copy-email.client";

/** Current roles come from the experience timeline, so the two pages can't drift apart. */
const currentRoles = experiences.filter((item) => item.period.endsWith("Present"));

export function AboutPage() {
  return (
    <div className="page-width subpage">
      <header className="page-heading">
        <h1>
          Making complex tasks
          <br className="desktop-break" /> feel simple.
        </h1>
        <p>{aboutData.intro}</p>
        <p>{aboutData.approach}</p>
        <dl className="about-facts">
          <dt>Based in</dt>
          <dd>Kathmandu, {aboutData.country}</dd>
          {currentRoles.length > 0 && (
            <>
              <dt>Currently</dt>
              <dd>{currentRoles.map((item) => `${item.role} at ${item.company}`).join(" · ")}</dd>
            </>
          )}
          <dt>Languages</dt>
          <dd>{personal.languages.join(" & ")}</dd>
        </dl>
      </header>

      <StrengthsSection />

      <section className="home-section" aria-labelledby="tools-heading">
        <h2 className="heading-section" id="tools-heading">
          Tools I Use
        </h2>
        <ul className="tool-list">
          {personal.tools.map((tool) => (
            <li key={tool.name}>
              <span className="tool-name">{tool.name}</span>
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
