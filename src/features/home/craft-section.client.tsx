"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { CraftSummary } from "@/content/types";
import { EASE, Reveal, Stagger, WordReveal, staggerItem } from "@/components/motion/portfolio-motion.client";
import { formatDate } from "@/features/blog/format-date";
import { ArrowUpRightIcon, SparkleIcon } from "@/components/ui/icons";

export function CraftSection({ items }: { items: CraftSummary[] }) {
  return (
    <section className="home-section" id="craft" data-dock="craft" aria-labelledby="craft-heading">
      <WordReveal text="Craft" id="craft-heading" className="heading-section" />
      {items.length ? (
        <Stagger className="craft-showcase" gap={0.07}>
          {items.slice(0, 6).map((item) => (
            <motion.div variants={staggerItem} key={item.slug} whileHover="hover">
              <Link className="craft-tile" href={`/craft/${item.slug}`}>
                <motion.div className="craft-media" variants={{ hover: { scale: 1.015 } }} transition={{ duration: 0.4, ease: EASE }}>
                  <img src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height} loading="lazy" />
                </motion.div>
                <div className="craft-meta">
                  <span>{item.title}</span>
                  {item.date && <time dateTime={item.date}>{formatDate(item.date)}</time>}
                </div>
              </Link>
            </motion.div>
          ))}
        </Stagger>
      ) : (
        <Reveal className="craft-placeholder">
          <div className="craft-placeholder-media" aria-hidden="true">
            <SparkleIcon size={28} />
          </div>
          <p>Interface explorations, components, and small ideas. New pieces will appear here.</p>
        </Reveal>
      )}
      <Reveal className="section-cta">
        <Link className="chip" href="/craft">
          <span>See my Craft</span>
          <ArrowUpRightIcon size={13} />
        </Link>
      </Reveal>
    </section>
  );
}
