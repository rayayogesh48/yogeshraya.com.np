import type { BlogEntry, CraftEntry, TestimonialEntry, WorkEntry } from "./types";

export function isPublished(entry: { status: "draft" | "published" }): boolean {
  return entry.status === "published";
}

export function sortWork(entries: WorkEntry[]): WorkEntry[] {
  return entries.sort((a, b) => (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (b.featuredOrder ?? Number.MAX_SAFE_INTEGER) || a.slug.localeCompare(b.slug));
}

export function sortBlog(entries: BlogEntry[]): BlogEntry[] {
  return entries.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function sortCraft(entries: CraftEntry[]): CraftEntry[] {
  return entries.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "") || a.slug.localeCompare(b.slug));
}

export function sortTestimonials(entries: TestimonialEntry[]): TestimonialEntry[] {
  return entries.sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) || a.slug.localeCompare(b.slug));
}
