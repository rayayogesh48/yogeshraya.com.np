import type { MetadataRoute } from "next";
import { listBlog, listCraft, listWork } from "@/content/catalog";
import { craftEnabled } from "@/config/features";
import { isPublicSite, siteUrl } from "@/config/site";
import { insightPath, insightsPath } from "@/config/routes";

/**
 * Every indexable page, matching each page's canonical URL exactly. `lastmod` only comes from real content dates
 * (Google ignores it when it looks inaccurate), and pages list their images so Google Images can find them.
 * `priority` and `changefreq` are left out because Google ignores them.
 */

type Entry = MetadataRoute.Sitemap[number];

/** Newest of the given YYYY-MM-DD dates, so listing pages change when something in them does. */
function latest(dates: (string | undefined)[]) {
  return dates.filter((date): date is string => Boolean(date)).sort().at(-1);
}

/** Local images used in a Markdown body (videos live under /videos and are not images). */
function bodyImages(markdown: string) {
  return [...markdown.matchAll(/!\[[^\]]*\]\((\/images\/[^\s)]+)/g)].map((match) => match[1]);
}

function page(path: string, updated?: string, images: (string | undefined)[] = []): Entry {
  const unique = [...new Set(images.filter((image): image is string => Boolean(image)))];
  return {
    url: `${siteUrl}${path}`,
    ...(updated ? { lastModified: updated } : {}),
    ...(unique.length ? { images: unique.map((image) => `${siteUrl}${image}`) } : {}),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isPublicSite) return [];
  const work = listWork();
  const craft = craftEnabled ? listCraft() : [];
  const posts = listBlog();
  const workUpdated = latest(work.map((study) => study.updated));
  const craftUpdated = latest(craft.map((item) => item.date));
  const postsUpdated = latest(posts.map((post) => post.updated ?? post.date));

  return [
    // Next.js renders the home canonical without a trailing slash; the sitemap must match it exactly.
    page("", latest([workUpdated, postsUpdated])),
    page("/work", workUpdated, work.map((study) => study.cover?.src ?? study.gallery?.[0]?.src)),
    page("/about"),
    ...(craftEnabled ? [page("/craft", craftUpdated, craft.map((item) => item.image.src))] : []),
    page(insightsPath, postsUpdated),
    ...work.map((study) =>
      page(`/work/${study.slug}`, study.updated, [study.cover?.src, ...(study.gallery ?? []).map((image) => image.src), ...bodyImages(study.content)]),
    ),
    ...craft.map((item) => page(`/craft/${item.slug}`, item.date, [item.image.src, ...bodyImages(item.content)])),
    ...posts.map((post) => page(insightPath(post.slug), post.updated ?? post.date, [post.cover, ...bodyImages(post.content)])),
  ];
}
