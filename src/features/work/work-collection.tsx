import { ProjectCard } from "./project-card";
import { Stagger } from "@/components/motion/portfolio-motion.client";
import type { WorkSummary } from "@/content/types";

export function WorkCollection({ publishedStudies }: { publishedStudies: WorkSummary[] }) {
  return (
    <div className="page-width subpage">
      <header className="page-heading">
        <h1>My Work</h1>
        <p>
          Selected client projects and website designs, with a focus on clarity,
          usability, and visual craft.
        </p>
      </header>
      <Stagger className="projects" gap={0.12}>
        {publishedStudies.map((study, index) => (
          <ProjectCard key={study.slug} study={study} index={index} />
        ))}
      </Stagger>
      {!publishedStudies.length && (
        <p className="empty-state">Selected projects will appear here.</p>
      )}
    </div>
  );
}
