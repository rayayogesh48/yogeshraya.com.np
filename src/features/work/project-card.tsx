"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { WorkSummary } from "@/content/types";
import { staggerItem } from "@/components/motion/portfolio-motion.client";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { mockThemes } from "./project-mock";
import { ProjectCarousel } from "./project-carousel.client";

/** Must be rendered inside a `Stagger` container so the entrance variants resolve. */
export function ProjectCard({ study, index = 0 }: { study: WorkSummary; index?: number }) {
  const images = study.gallery ?? (study.cover ? [study.cover] : []);
  const href = `/work/${study.slug}`;
  const shortTitle = study.title.split(" — ")[0];

  return (
    <motion.article variants={staggerItem} className="project-card">
      <ProjectCarousel
        title={study.title}
        shortTitle={shortTitle}
        tags={study.tags}
        images={images}
        theme={mockThemes[index % mockThemes.length]}
      />
      <Link className="project-meta" href={href}>
        <div className="project-title-row">
          <h3>{study.title}</h3>
          <span className="project-arrow" aria-hidden="true">
            <ArrowUpRightIcon size={14} />
          </span>
        </div>
        <p>{study.summary}</p>
      </Link>
    </motion.article>
  );
}
