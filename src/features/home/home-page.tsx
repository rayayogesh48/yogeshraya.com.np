import { Fragment } from "react";
import type { BlogSummary, CraftSummary, WorkSummary } from "@/content/types";
import { Hero } from "./hero.client";
import { WorkSection } from "./work-section";
import { ExperienceSection } from "./experience-section.client";
import { StrengthsSection } from "./strengths-section.client";
import { AboutSection } from "./about-section.client";
import { CraftSection } from "./craft-section.client";
import { InsightsSection } from "./insights-section.client";

export function HomePage({ work, craft, posts }: { work: WorkSummary[]; craft: CraftSummary[]; posts: BlogSummary[] }) {
  const sections = [
    <WorkSection key="work" studies={work} />,
    <ExperienceSection key="experience" />,
    <StrengthsSection key="skills" />,
    <AboutSection key="about" />,
    <CraftSection key="craft" items={craft} />,
    <InsightsSection key="insights" posts={posts} />,
  ];
  return (
    <div className="page-width">
      <Hero />
      {sections.map((section) => (
        <Fragment key={section.key}>
          <hr className="divider" />
          {section}
        </Fragment>
      ))}
      <hr className="divider" />
    </div>
  );
}
