import type { BlogEntry, BlogSummary, CraftEntry, CraftSummary, WorkEntry, WorkSummary } from "./types";

export function workSummary({ content, status, relatedInsights, ...summary }: WorkEntry): WorkSummary { void content; void status; void relatedInsights; return summary; }
export function blogSummary({ content, status, ...summary }: BlogEntry): BlogSummary {
  void status;
  // Cards show the cover, or the first image in the post (videos and remote images are skipped).
  const firstImage = content.match(/!\[([^\]]*)\]\((\/images\/[^\s)]+)/);
  const thumbnail = summary.cover
    ? { src: summary.cover, alt: summary.coverAlt ?? "" }
    : firstImage
      ? { src: firstImage[2], alt: firstImage[1] }
      : undefined;
  return thumbnail ? { ...summary, thumbnail } : summary;
}
export function craftSummary({ content, status, ...summary }: CraftEntry): CraftSummary { void content; void status; return summary; }
