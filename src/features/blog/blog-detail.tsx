import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MarkdownContent } from "@/components/markdown/markdown";
import { ImmersiveReader } from "@/components/reader/immersive-reader.client";
import { ShareButton } from "@/components/article/share-button.client";
import { TableOfContents } from "@/components/article/table-of-contents.client";
import { speechBlocks } from "@/lib/speech/blocks";
import { articleSections } from "@/lib/headings";
import { immersiveReaderEnabled } from "@/config/features";
import { formatDate } from "@/features/blog/format-date";
import { InsightList } from "@/features/blog/insight-list";
import type { BlogEntry, BlogSummary } from "@/content/types";
import { blogSummary } from "@/content/projections";
import { insightsPath } from "@/config/routes";
import { aboutData } from "@site/profile";

/** Insight article: title, subtitle and byline, a share row, the cover, the body with a contents rail, then more insights. */
export function BlogDetail({ post, more }: { post: BlogEntry; more: BlogSummary[] }) {
  const body = <MarkdownContent content={post.content} className="article-body" />;
  // Read-aloud needs a Gemini key on the server; without one the reader simply has no Listen button.
  const speech = immersiveReaderEnabled && process.env.GEMINI_API_KEY ? { kind: "insight" as const, slug: post.slug, blocks: speechBlocks(post.title, post.content) } : undefined;
  const avatar = aboutData.portraitSizes?.[1]?.src ?? aboutData.portrait;
  const cover = blogSummary(post).thumbnail;
  const contactHref = aboutData.email ? `mailto:${aboutData.email}` : (aboutData.socials.linkedin ?? "/about#contact");
  return (
    <article className="page-width subpage article">
      <div className="detail-topbar">
        <Link href={insightsPath} className="text-link back-link">
          <ArrowLeft size={15} />
          Back to Insights
        </Link>
        {immersiveReaderEnabled && <ImmersiveReader title={post.title} meta={`${formatDate(post.date)} · ${post.readingTime}`} content={body} speech={speech} />}
      </div>

      <header className="article-header">
        <h1>{post.title}</h1>
        <p className="article-subtitle">{post.description}</p>
      </header>

      {/* The same image the post's card uses: its cover, or else the first image in the post. */}
      {cover && <img className="article-cover" src={cover.src} alt={cover.alt || post.title} width={800} height={450} />}

      <TableOfContents items={articleSections(post.content)} />
      {body}

      <aside className="article-signoff" aria-label="About the author">
        {avatar && <img className="article-signoff-avatar" src={avatar} alt="" width={56} height={56} />}
        <div className="article-signoff-text">
          <p className="article-signoff-label">Written by</p>
          <Link href="/about" className="article-signoff-name">
            {aboutData.name}
          </Link>
          <p className="article-signoff-bio">{aboutData.headline}</p>
        </div>
        <div className="article-signoff-actions">
          <ShareButton title={post.title} />
          <a className="article-action article-action-primary" href={contactHref} {...(contactHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            Get in touch
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </aside>

      {more.length > 0 && (
        <section className="more-insights" aria-labelledby="more-insights-heading">
          <h2 id="more-insights-heading">More insights</h2>
          <InsightList posts={more} titleAs="h3" />
          <Link className="chip more-insights-all" href={insightsPath}>
            <span>See all</span>
            <ArrowUpRight size={13} />
          </Link>
        </section>
      )}
    </article>
  );
}
