"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { experiences, type ExperienceItem } from "@site/experience";
import { EASE, Stagger, WordReveal, staggerItem } from "@/components/motion/portfolio-motion.client";
import { ArrowUpRightIcon, ChevronDownIcon } from "@/components/ui/icons";

function initials(company: string) {
  return company
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .filter((word) => /^[A-Za-z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function ExperienceEntry({ item }: { item: ExperienceItem }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <motion.div variants={staggerItem} className="exp-entry">
      <div className="exp-icon">
        {item.logo ? (
          <img className="exp-logo" src={item.logo} alt="" width={32} height={32} />
        ) : (
          <span className="exp-mark" aria-hidden="true">
            {initials(item.company)}
          </span>
        )}
      </div>
      <div className="exp-card">
        <button type="button" className="exp-trigger" aria-expanded={open} aria-controls={open ? panelId : undefined} onClick={() => setOpen((value) => !value)}>
          <span>
            <span className="exp-company">{item.company}</span>
            <span className="exp-meta">
              {item.period}
              {item.location && ` · ${item.location}`}
            </span>
          </span>
          <motion.span className="exp-chevron" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE }}>
            <ChevronDownIcon size={15} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              className="exp-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="exp-content-inner">
                {item.summary && <p className="exp-summary">{item.summary}</p>}
                <ul>
                  {item.contributions.map((text, line) => (
                    <motion.li
                      key={text}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + line * 0.05, duration: 0.3 }}
                    >
                      {text}
                    </motion.li>
                  ))}
                </ul>
                {item.caseStudySlug && (
                  <Link className="exp-link" href={`/work/${item.caseStudySlug}`}>
                    Explore the work
                    <ArrowUpRightIcon size={13} />
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function ExperienceSection() {
  return (
    <section className="home-section" id="experience" data-dock="about" aria-labelledby="experience-heading">
      <WordReveal text="Experience" id="experience-heading" className="heading-section" />
      <Stagger className="exp-stack" gap={0.08}>
        {experiences.map((item) => (
          <ExperienceEntry key={item.company} item={item} />
        ))}
      </Stagger>
    </section>
  );
}
