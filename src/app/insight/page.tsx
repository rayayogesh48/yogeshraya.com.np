import { listPublishedBlogPosts } from "@/content/server";
import { BlogCollection } from "@/features/blog/blog-collection";
import { pageMetadata } from "@/lib/seo";
import { insightsPath } from "@/config/routes";

export const metadata = pageMetadata(
  "Product Design Insights",
  "Insights and practical thoughts on product design, useful design feedback, and solving the right user problems by Yogesh Raya.",
  insightsPath,
);
export default function Page() {
  return <BlogCollection posts={listPublishedBlogPosts()} />;
}
