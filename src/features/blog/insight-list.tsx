import Link from "next/link";
import type { BlogSummary } from "@/content/types";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { insightPath } from "@/config/routes";
import { formatDate } from "./format-date";

type TitleTag = "h2" | "h3";

/** One insight link: title and description on the left, date (and optional reading time) with a hover arrow on the right. */
export function InsightRow({
  post,
  titleAs: Title = "h3",
  showReadingTime = false,
}: {
  post: BlogSummary;
  titleAs?: TitleTag;
  showReadingTime?: boolean;
}) {
  return (
    <Link className="insights-row" href={insightPath(post.slug)}>
      <span>
        <Title>{post.title}</Title>
        <p>{post.description}</p>
      </span>
      <span className="insights-meta">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {showReadingTime && <span className="insights-reading">{post.readingTime}</span>}
        <span className="insights-arrow" aria-hidden="true">
          <ArrowUpRightIcon size={13} />
        </span>
      </span>
    </Link>
  );
}

/** Static list of insights, shared by the insights index and related-insights sections. The home page animates the same rows. */
export function InsightList({
  posts,
  titleAs = "h2",
  showReadingTime = false,
}: {
  posts: BlogSummary[];
  /** Use "h3" when the list sits under its own section heading. */
  titleAs?: TitleTag;
  showReadingTime?: boolean;
}) {
  if (!posts.length) return <p className="section-empty">Insights coming soon.</p>;
  return (
    <div className="insights-list">
      {posts.map((post) => (
        <article className="insights-item" key={post.slug}>
          <InsightRow post={post} titleAs={titleAs} showReadingTime={showReadingTime} />
        </article>
      ))}
    </div>
  );
}
