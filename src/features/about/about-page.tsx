import {
  ArrowUpRight,
  BookOpen,
  Focus,
  Languages,
  Clock3,
  Sparkles,
  Download,
} from "lucide-react";
import { aboutData, personal } from "@site/profile";
import { StrengthsSection } from "@/features/home/strengths-section.client";
import { NepalClock } from "@/components/site/nepal-clock.client";
import { SectionHeading } from "@/components/ui/section-heading";
import { CopyEmail } from "@/components/site/copy-email.client";
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
        <p>
          My experience includes product design at Bytecare Technology,
          alongside product and interface design work for digital products.
        </p>
      </header>
      <section className="personal-grid" aria-label="Life and work">
        <div className="personal-card time-card">
          <span className="card-label">
            <Clock3 size={15} />
            Local time
          </span>
          <NepalClock />
        </div>
        <div className="personal-card">
          <span className="card-label">
            <Focus size={15} />
            Current focus
          </span>
          <p>{personal.focus}</p>
        </div>
        <div className="personal-card">
          <span className="card-label">
            <Languages size={15} />I speak
          </span>
          <p>{personal.languages.join(" & ")}</p>
        </div>
        <div className="personal-card">
          <span className="card-label">
            <BookOpen size={15} />
            Reading & interests
          </span>
          <p className="muted">{personal.reading}</p>
        </div>
        <div className="personal-card activity-card">
          <span className="card-label">
            <Sparkles size={15} />
            Current activity
          </span>
          <p className="muted">{personal.activity}</p>
        </div>
      </section>
      <StrengthsSection />
      <section className="section">
        <SectionHeading title="Tools I Use" />
        <p className="body-copy">
          For exploring ideas, understanding behavior, and making better product
          decisions.
        </p>
        <div className="tools-grid">
          {personal.tools.map((tool, index) => (
            <div className="tool" key={tool}>
              <span className={`tool-symbol tool-${index}`} aria-hidden="true">
                {["F", "m", "c", "↗"][index]}
              </span>
              <span>{tool}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <SectionHeading title="Design Philosophy" />
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
            <a
              className="button primary"
              href={aboutData.socials.linkedin}
              target="_blank"
              rel="noreferrer"
            >
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
