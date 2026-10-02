import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarkdownContent } from "@/components/markdown/markdown";
import { formatDate } from "@/features/blog/format-date";
import type { BlogEntry } from "@/content/types";
import { insightsPath } from "@/config/routes";

export function BlogDetail({ post }: { post: BlogEntry }) {
  return (
    <article className="page-width subpage">
      <Link href={insightsPath} className="text-link back-link">
        <ArrowLeft size={15} />
        Back to Insights
      </Link>
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
      <MarkdownContent content={post.content} />
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
