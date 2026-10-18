"use client";

import { motion } from "motion/react";
import { aboutData, principles } from "@site/profile";
import { Reveal, Stagger, WordReveal, staggerItem } from "@/components/motion/portfolio-motion.client";
import { ParticleStar } from "@/components/visual/particle-canvas.client";

export function AboutMeSection() {
  return (
    <section className="home-section" id="about" aria-labelledby="about-heading">
      <Reveal className="about-star">
        <ParticleStar size={150} />
      </Reveal>
      <WordReveal as="h1" text="About me" id="about-heading" className="heading-section" />
      <Reveal as="p" className="about-p">
        {aboutData.approach}
      </Reveal>
      <Stagger as="ul" className="about-list" gap={0.08}>
        {principles.map((item) => (
          <motion.li variants={staggerItem} key={item}>
            {item}
          </motion.li>
        ))}
      </Stagger>
    </section>
  );
}
