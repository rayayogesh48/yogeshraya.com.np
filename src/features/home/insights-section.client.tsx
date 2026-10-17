"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { BlogSummary } from "@/content/types";
import { Reveal, Stagger, WordReveal, staggerItem } from "@/components/motion/portfolio-motion.client";
import { InsightRow } from "@/features/blog/insight-list";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { insightsPath } from "@/config/routes";

export function InsightsSection({ posts }: { posts: BlogSummary[] }) {
  return (
    <section className="home-section" id="insights" data-dock="insights" aria-labelledby="insights-heading">
      <WordReveal text="Insights" id="insights-heading" className="heading-section" />
      {posts.length ? (
        <Stagger className="insights-list" gap={0.08}>
          {posts.slice(0, 3).map((post) => (
            <motion.div className="insights-item" variants={staggerItem} key={post.slug}>
              <InsightRow post={post} />
            </motion.div>
          ))}
        </Stagger>
      ) : (
        <p className="section-empty">Insights coming soon.</p>
      )}
      <Reveal className="section-cta">
        <Link className="chip" href={insightsPath}>
          <span>All insights</span>
          <ArrowUpRightIcon size={13} />
        </Link>
      </Reveal>
    </section>
  );
}
