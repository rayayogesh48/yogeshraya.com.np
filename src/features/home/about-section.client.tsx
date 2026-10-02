"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { aboutData, principles } from "@site/profile";
import { Reveal, Stagger, WordReveal, staggerItem } from "@/components/motion/portfolio-motion.client";
import { ParticleStar } from "@/components/visual/particle-canvas.client";
import { ArrowUpRightIcon } from "@/components/ui/icons";

export function AboutSection() {
  return (
    <section className="home-section" id="about" data-dock="about" aria-labelledby="about-heading">
      <Reveal className="about-star">
        <ParticleStar size={150} />
      </Reveal>
      <WordReveal text="About me" id="about-heading" className="heading-section" />
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
      <Reveal className="section-cta">
        <Link className="chip" href="/about">
          <span>Read full story</span>
          <ArrowUpRightIcon size={13} />
        </Link>
      </Reveal>
    </section>
  );
}
