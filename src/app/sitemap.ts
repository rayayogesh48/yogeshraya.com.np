import type { MetadataRoute } from "next";
import { listPublishedBlogPosts, listPublishedCraft, listPublishedWork } from "@/content/server";
import { isPublicSite, siteUrl } from "@/config/site";
import { insightPath, insightsPath } from "@/config/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isPublicSite) return [];
  return [
    ...["", "/work", "/about", "/craft", insightsPath].map((route) => ({
      url: `${siteUrl}${route}`,
      priority: route ? 0.8 : 1,
    })),
    ...listPublishedWork().map((study) => ({
      url: `${siteUrl}/work/${study.slug}`,
      priority: 0.8,
    })),
    ...listPublishedCraft().map((item) => ({
      url: `${siteUrl}/craft/${item.slug}`,
      ...(item.date ? { lastModified: new Date(item.date) } : {}),
    })),
    ...listPublishedBlogPosts().map((post) => ({
      url: `${siteUrl}${insightPath(post.slug)}`,
      lastModified: new Date(post.date),
      priority: 0.7,
    })),
  ];
}
