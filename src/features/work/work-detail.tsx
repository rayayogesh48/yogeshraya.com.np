import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MarkdownContent } from "@/components/markdown/markdown";
import { ImmersiveReader } from "@/components/reader/immersive-reader.client";
import { ArticleSignoff } from "@/components/article/article-signoff";
import { TableOfContents } from "@/components/article/table-of-contents.client";
import { speechBlocks } from "@/lib/speech/blocks";
import { articleSections } from "@/lib/headings";
import { immersiveReaderEnabled } from "@/config/features";
import { ProjectGallery } from "@/components/media/image-gallery.client";
import type { BlogSummary, WorkEntry } from "@/content/types";
import { InsightList } from "@/features/blog/insight-list";
import { insightsPath } from "@/config/routes";

/** Case study, laid out like an insight article: header and facts, cover or gallery, body with a contents rail, sign-off, related insights. */
export function WorkDetail({ study, insights }: { study: WorkEntry; insights: BlogSummary[] }) {
  const images = study.gallery ?? (study.cover ? [study.cover] : []);
  const markdown = study.content.replace(/^#\s+[^\n]+\n/, "");
  const body = <MarkdownContent content={markdown} className="article-body" />;
  // Read-aloud needs a Gemini key on the server; without one the reader simply has no Listen button.
  const speech = immersiveReaderEnabled && process.env.GEMINI_API_KEY ? { kind: "work" as const, slug: study.slug, blocks: speechBlocks(study.title, markdown) } : undefined;
  const facts = [
    { label: "Role", value: study.role },
    { label: "Focus", value: study.timeline },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <article className="page-width subpage article">
      <div className="detail-topbar">
        <Link href="/work" className="text-link back-link">
          <ArrowLeft size={15} />
          Back to Work
        </Link>
        {immersiveReaderEnabled && <ImmersiveReader title={study.title} meta={`Case study · ${study.role}`} content={body} speech={speech} />}
      </div>

      <header className="article-header">
        <h1>{study.title}</h1>
        <p className="article-subtitle">{study.summary}</p>
        {facts.length > 0 && (
          <dl className="article-facts">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {images.length > 1 ? (
        <div className="article-gallery">
          <ProjectGallery images={images} title={study.title} />
        </div>
      ) : (
        images[0] && <img className="article-cover" src={images[0].src} alt={images[0].alt} width={images[0].width} height={images[0].height} />
      )}

      <TableOfContents items={articleSections(markdown)} />
      {body}

      <ArticleSignoff title={study.title} label="Case study by" />

      {insights.length > 0 && (
        <section className="more-insights" aria-labelledby="related-insights-heading">
          <h2 id="related-insights-heading">Related insights</h2>
          <InsightList posts={insights} titleAs="h3" />
          <Link className="chip more-insights-all" href={insightsPath}>
            <span>All insights</span>
            <ArrowUpRight size={13} />
          </Link>
        </section>
      )}
    </article>
  );
}
