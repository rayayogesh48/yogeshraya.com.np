"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { BlogSummary } from "@/content/types";
import { Reveal, Stagger, WordReveal, staggerItem } from "@/components/motion/portfolio-motion.client";
import { formatDate } from "@/features/blog/format-date";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { insightPath, insightsPath } from "@/config/routes";

export function InsightsSection({ posts }: { posts: BlogSummary[] }) {
  return (
    <section className="home-section" id="insights" data-dock="insights" aria-labelledby="insights-heading">
      <WordReveal text="Insights" id="insights-heading" className="heading-section" />
      {posts.length ? (
        <Stagger className="insights-list" gap={0.08}>
          {posts.slice(0, 3).map((post) => (
            <motion.div variants={staggerItem} key={post.slug}>
              <Link className="insights-row" href={insightPath(post.slug)}>
                <span>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                </span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </Link>
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
