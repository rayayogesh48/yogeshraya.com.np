"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Shapes } from "lucide-react";
import type { CraftSummary } from "@/content/types";

const PAGE_SIZE = 12;

export function CraftCollection({ items }: { items: CraftSummary[] }) {
  const [category, setCategory] = useState("All");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const reduced = useReducedMotion();
  const categories = [
    "All",
    ...Array.from(new Set(items.map((item) => item.category))),
  ];
  const filtered = items.filter(
    (item) => category === "All" || item.category === category,
  );
  const visible = filtered.slice(0, limit);
  if (!items.length)
    return (
      <div className="craft-empty">
        <div className="craft-empty-icon" aria-hidden="true">
          <Shapes size={30} strokeWidth={1.2} />
        </div>
        <h3>Small details. Thoughtful design.</h3>
        <p>
          A space for interface explorations, components, and ideas.
          <br />
          New pieces will appear here.
        </p>
      </div>
    );
  return (
    <>
      <div className="craft-filters" aria-label="Filter craft by category">
        {categories.map((name) => (
          <button
            type="button"
            key={name}
            aria-pressed={category === name}
            onClick={() => {
              setCategory(name);
              setLimit(PAGE_SIZE);
            }}
          >
            {category === name && (
              <motion.span
                layoutId="craft-filter-thumb"
                className="craft-filter-thumb"
                aria-hidden="true"
                transition={reduced ? { duration: 0 } : { type: "spring", duration: 0.35, bounce: 0.15 }}
              />
            )}
            <span className="craft-filter-label">{name}</span>
            <span className="craft-filter-count">
              {name === "All"
                ? items.length
                : items.filter((item) => item.category === name).length}
            </span>
          </button>
        ))}
      </div>
      {/* Masonry: each tile keeps its image's own shape, so tall and wide pieces sit together. */}
      <div className="craft-grid">
        <AnimatePresence initial={false}>
          {visible.map((item) => (
            <motion.article
              key={item.slug}
              className="craft-tile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.18 }}
            >
              <Link href={`/craft/${item.slug}`} className="craft-card">
                <div className="craft-card-media">
                  <img
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    loading="lazy"
                  />
                </div>
                <div className="craft-card-caption">
                  <h3>{item.title}</h3>
                  <span>{item.category}</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
      {visible.length < filtered.length && (
        <button
          type="button"
          className="button secondary load-more"
          onClick={() => setLimit((value) => value + PAGE_SIZE)}
        >
          Load More
          <span className="muted">({filtered.length - visible.length})</span>
        </button>
      )}
      <p className="sr-only" role="status">
        Showing {visible.length} of {filtered.length} pieces in {category}.
      </p>
    </>
  );
}
