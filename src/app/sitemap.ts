import type { MetadataRoute } from "next";
import { listPublishedBlogPosts, listPublishedCraft, listPublishedWork } from "@/content/server";
import { isPublicSite, siteUrl } from "@/config/site";
import { insightPath, insightsPath } from "@/config/routes";

/** Newest of the given YYYY-MM-DD dates, so listing pages change when something in them does. */
function latest(dates: (string | undefined)[]) {
  const known = dates.filter((date): date is string => Boolean(date)).sort();
  return known.length ? new Date(known[known.length - 1]) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isPublicSite) return [];
  const work = listPublishedWork();
  const craft = listPublishedCraft();
  const posts = listPublishedBlogPosts();
  const workUpdated = latest(work.map((study) => study.updated));
  const craftUpdated = latest(craft.map((item) => item.date));
  const postsUpdated = latest(posts.map((post) => post.date));
  const page = (route: string, priority: number, lastModified?: Date): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${route}`,
    priority,
    ...(lastModified ? { lastModified } : {}),
  });
  return [
    page("", 1, latest([workUpdated, craftUpdated, postsUpdated].map((date) => date?.toISOString().slice(0, 10)))),
    page("/work", 0.8, workUpdated),
    page("/about", 0.8),
    page("/craft", 0.8, craftUpdated),
    page(insightsPath, 0.8, postsUpdated),
    ...work.map((study) => page(`/work/${study.slug}`, 0.8, study.updated ? new Date(study.updated) : undefined)),
    ...craft.map((item) => page(`/craft/${item.slug}`, 0.5, item.date ? new Date(item.date) : undefined)),
    ...posts.map((post) => page(insightPath(post.slug), 0.7, new Date(post.date))),
  ];
}
