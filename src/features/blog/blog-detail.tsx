import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarkdownContent } from "@/components/markdown/markdown";
import { ImmersiveReader } from "@/components/reader/immersive-reader.client";
import { speechBlocks } from "@/lib/speech/blocks";
import { immersiveReaderEnabled } from "@/config/features";
import { formatDate } from "@/features/blog/format-date";
import type { BlogEntry } from "@/content/types";
import { insightsPath } from "@/config/routes";

export function BlogDetail({ post }: { post: BlogEntry }) {
  const body = <MarkdownContent content={post.content} />;
  // Read-aloud needs a Gemini key on the server; without one the reader simply has no Listen button.
  const speech = immersiveReaderEnabled && process.env.GEMINI_API_KEY ? { kind: "insight" as const, slug: post.slug, blocks: speechBlocks(post.title, post.content) } : undefined;
  return (
    <article className="page-width subpage">
      <div className="detail-topbar">
        <Link href={insightsPath} className="text-link back-link">
          <ArrowLeft size={15} />
          Back to Insights
        </Link>
        {immersiveReaderEnabled && <ImmersiveReader title={post.title} meta={`${formatDate(post.date)} · ${post.readingTime}`} content={body} speech={speech} />}
      </div>
      <header className="page-heading article-heading">
        <div className="article-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readingTime}</span>
        </div>
        <h1>{post.title}</h1>
        <p>{post.description}</p>
        {post.cover && (
          <img
            className="article-cover"
            src={post.cover}
            alt={post.coverAlt || post.title}
            width={800}
            height={400}
          />
        )}
      </header>
      {body}
      <div className="article-footer">
        <Link href={insightsPath} className="text-link">
          <ArrowLeft size={15} />
          Back to Insights
        </Link>
        <Link href="/work" className="text-link">
          Explore my work
        </Link>
      </div>
    </article>
  );
}
