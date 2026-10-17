import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarkdownContent } from "@/components/markdown/markdown";
import { ProjectGallery } from "@/components/media/image-gallery.client";
import type { BlogSummary, WorkEntry } from "@/content/types";
import { InsightList } from "@/features/blog/insight-list";
import { insightsPath } from "@/config/routes";

export function WorkDetail({ study, insights }: { study: WorkEntry; insights: BlogSummary[] }) {
  const images =
    study.gallery ?? (study.cover ? [study.cover] : []);
  return (
    <article className="page-width subpage">
      <Link href="/work" className="text-link back-link">
        <ArrowLeft size={15} />
        Back to Work
      </Link>
      <header className="page-heading article-heading">
        <h1>{study.title}</h1>
        <p>{study.summary}</p>
        <div className="detail-metadata">
          <div>
            <span className="detail-label">Role</span>
            {study.role}
          </div>
          <div>
            <span className="detail-label">Focus</span>
            {study.timeline}
          </div>
        </div>
        {images.length > 0 && (
          <ProjectGallery images={images} title={study.title} />
        )}
      </header>
      <MarkdownContent content={study.content.replace(/^#\s+[^\n]+\n/, "")} />
      {insights.length > 0 && (
        <section className="related-insights" aria-labelledby="related-insights-heading">
          <h2 id="related-insights-heading">Related insights</h2>
          <InsightList posts={insights} titleAs="h3" showReadingTime />
        </section>
      )}
      <div className="article-footer">
        <Link href="/work" className="text-link">
          <ArrowLeft size={15} />
          Back to Work
        </Link>
        <Link href={insightsPath} className="text-link">
          Explore my insights
        </Link>
      </div>
    </article>
  );
}
