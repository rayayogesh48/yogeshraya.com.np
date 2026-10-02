import Link from "next/link";
import type { WorkSummary } from "@/content/types";
import { Reveal, Stagger, WordReveal } from "@/components/motion/portfolio-motion.client";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { ProjectCard } from "@/features/work/project-card";

export function WorkSection({ studies }: { studies: WorkSummary[] }) {
  const featured = studies
    .filter((study) => study.featuredOrder !== undefined)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
  return (
    <section className="home-section" id="work" data-dock="work" aria-labelledby="work-heading">
      <WordReveal text="My Work" id="work-heading" className="heading-section" />
      {featured.length ? (
        <Stagger className="projects" gap={0.12}>
          {featured.map((study, index) => (
            <ProjectCard key={study.slug} study={study} index={index} />
          ))}
        </Stagger>
      ) : (
        <p className="section-empty">Selected projects will appear here.</p>
      )}
      <Reveal className="section-cta">
        <Link className="chip" href="/work">
          <span>View all projects</span>
          <ArrowUpRightIcon size={13} />
        </Link>
      </Reveal>
    </section>
  );
}
