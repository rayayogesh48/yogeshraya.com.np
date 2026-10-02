import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogSummary } from "@/content/types";
import { formatDate } from "./format-date";
import { insightPath } from "@/config/routes";

export function ArticleList({
  posts,
  titleAs: Title = "h2",
}: {
  posts: BlogSummary[];
  /** Use "h3" when the list sits under its own section heading. */
  titleAs?: "h2" | "h3";
}) {
  return (
    <div className="article-list">
      {posts.map((post) => (
        <article key={post.slug}>
          <Link href={insightPath(post.slug)} className="article-link">
            <div className="article-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>{post.readingTime}</span>
            </div>
            <div className="article-title">
              <Title>{post.title}</Title>
              <ArrowUpRight size={18} aria-hidden="true" />
            </div>
            <p>{post.description}</p>
          </Link>
        </article>
      ))}
      {!posts.length && <p className="empty-state">Insights coming soon.</p>}
    </div>
  );
}
