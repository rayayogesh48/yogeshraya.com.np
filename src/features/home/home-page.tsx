import { Fragment } from "react";
import type { BlogSummary, TestimonialSummary, WorkSummary } from "@/content/types";
import { Hero } from "./hero.client";
import { WorkSection } from "./work-section";
import { InsightsSection } from "./insights-section.client";
import { TestimonialsSection } from "./testimonials-section.client";

/** The home page stays focused on work and writing; the rest of the story lives on /about and /craft. */
export function HomePage({
  work,
  testimonials,
  posts,
}: {
  work: WorkSummary[];
  testimonials: TestimonialSummary[];
  posts: BlogSummary[];
}) {
  const sections = [
    <WorkSection key="work" studies={work} />,
    // Hidden until a testimonial is published, so the page never shows an empty section or a stray divider.
    ...(testimonials.length ? [<TestimonialsSection key="testimonials" testimonials={testimonials} />] : []),
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
