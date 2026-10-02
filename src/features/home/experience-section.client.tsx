"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { experiences, type ExperienceItem } from "@site/experience";
import { EASE, Stagger, WordReveal, staggerItem } from "@/components/motion/portfolio-motion.client";
import { ArrowUpRightIcon, ChevronDownIcon, Mark } from "@/components/ui/icons";

const markColors = ["#e2483d", "#2563eb", "#0f8b8d", "#7c3aed"];

function initials(company: string) {
  return company
    .split(/\s+/)
    .filter((word) => /^[A-Za-z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function ExperienceEntry({ item, index }: { item: ExperienceItem; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <motion.div variants={staggerItem} className="exp-entry">
      <div className="exp-icon">
        <Mark label={initials(item.company)} color={markColors[index % markColors.length]} size={36} radius={11} />
      </div>
      <div className="exp-card">
        <button type="button" className="exp-trigger" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
          <span>
            <span className="exp-title">
              <span className="exp-company">{item.company}</span>
              <span className="exp-role">- {item.role}</span>
            </span>
            <span className="exp-meta">
              <span>{item.period}</span>
              {item.location && (
                <>
                  <i aria-hidden="true" />
                  <span>{item.location}</span>
                </>
              )}
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
      <div className="exp-list">
        <motion.div
          className="exp-line"
          aria-hidden="true"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: EASE }}
        />
        <Stagger className="exp-stack" gap={0.1}>
          {experiences.map((item, index) => (
            <ExperienceEntry key={item.company} item={item} index={index} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
