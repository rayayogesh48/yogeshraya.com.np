import Link from "next/link";
import type { BlogSummary } from "@/content/types";
import { insightPath } from "@/config/routes";
import { formatDate, formatDay } from "./format-date";

type TitleTag = "h2" | "h3";

/**
 * One insight card: title, a short subtitle and a small date line on the left, with the post's thumbnail on the
 * right when it has one. `compactDate` drops the year for lists that already sit under a month heading.
 */
export function InsightRow({
  post,
  titleAs: Title = "h3",
  compactDate = false,
}: {
  post: BlogSummary;
  titleAs?: TitleTag;
  compactDate?: boolean;
}) {
  return (
    <Link className="insights-row" href={insightPath(post.slug)}>
      <span className="insights-text">
        <Title>{post.title}</Title>
        <p>{post.description}</p>
        <span className="insights-meta">
          <time dateTime={post.date}>{compactDate ? formatDay(post.date) : formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
        </span>
      </span>
      {post.thumbnail && (
        <img className="insights-thumb" src={post.thumbnail.src} alt="" width={160} height={90} loading="lazy" />
      )}
    </Link>
  );
}

/** Static list of insight cards, used for related insights and "more insights" lists. The home page animates the same cards. */
export function InsightList({
  posts,
  titleAs = "h2",
}: {
  posts: BlogSummary[];
  /** Use "h3" when the list sits under its own section heading. */
  titleAs?: TitleTag;
}) {
  if (!posts.length) return <p className="section-empty">Insights coming soon.</p>;
  return (
    <div className="insights-list">
      {posts.map((post) => (
        <article className="insights-item" key={post.slug}>
          <InsightRow post={post} titleAs={titleAs} />
        </article>
      ))}
    </div>
  );
}
