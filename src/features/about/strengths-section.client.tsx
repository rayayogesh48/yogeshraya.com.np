"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { strengths } from "@site/profile";
import { EASE, Stagger, WordReveal, staggerItem } from "@/components/motion/portfolio-motion.client";

export function StrengthsSection() {
  // Hover previews a row; a click (or tap, or keyboard) pins it so the click never collapses what hover opened.
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const active = hovered ?? pinned;
  return (
    <section className="home-section" id="skills" aria-labelledby="skills-heading">
      <WordReveal text="What I Do Best" id="skills-heading" className="heading-section" />
      <Stagger className="skill-manifesto" gap={0.08}>
        {strengths.map((item, index) => {
          const on = active === index;
          const detailId = `skill-detail-${index}`;
          return (
            <motion.div
              variants={staggerItem}
              key={item.title}
              className="skill-row"
              data-dim={active !== null && !on}
              onHoverStart={() => setHovered(index)}
              onHoverEnd={() => setHovered((current) => (current === index ? null : current))}
            >
              <span className="skill-num" data-on={on} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="skill-body">
                <h3 className="skill-headline">
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={detailId}
                    onClick={() => setPinned((current) => (current === index ? null : index))}
                  >
                    {item.title}
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.p
                      id={detailId}
                      className="skill-detail"
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 6 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      {item.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </Stagger>
    </section>
  );
}
