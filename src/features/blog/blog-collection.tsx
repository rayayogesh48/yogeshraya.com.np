import { InsightArchive } from "./insight-archive.client";
import type { BlogSummary } from "@/content/types";

export function BlogCollection({ posts }: { posts: BlogSummary[] }) {
  return (
    <div className="page-width subpage">
      <header className="page-heading">
        <h1>Insights</h1>
        <p>
          My thoughts on product design, useful feedback, and solving the right
          problems.
        </p>
      </header>
      <InsightArchive posts={posts} />
    </div>
  );
}
