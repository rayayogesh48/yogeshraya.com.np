import { notFound } from "next/navigation";
import { getPublishedBlogPost, listPublishedBlogPosts } from "@/content/server";
import { BlogDetail } from "@/features/blog/blog-detail";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, articleSchema } from "@/lib/structured-data";
import { insightPath } from "@/config/routes";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return listPublishedBlogPosts().map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const post = getPublishedBlogPost((await params).slug);
  if (!post) notFound();
  const metadata = pageMetadata(post.title, post.description, insightPath(post.slug));
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, type: "article" as const, publishedTime: post.date, authors: ["Yogesh Raya"] },
  };
}
export default async function Page({ params }: Props) {
  const post = getPublishedBlogPost((await params).slug);
  if (!post) notFound();
  return (
    <>
      <JsonLd data={articleSchema(post)} />
      <BlogDetail post={post} />
    </>
  );
}
