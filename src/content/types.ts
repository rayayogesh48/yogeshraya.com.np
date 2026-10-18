import type { BlogFields, CraftFields, TestimonialFields, WorkFields } from "./schemas";

export type Collection = "work" | "blog" | "craft" | "testimonials";
export type ContentRecord = WorkEntry | BlogEntry | CraftEntry | TestimonialEntry;

export type WorkEntry = WorkFields & { slug: string; content: string };
// Related insights resolve on the server; summaries reach client components and must not expose draft slugs.
export type WorkSummary = Omit<WorkEntry, "content" | "status" | "relatedInsights">;
export type BlogEntry = BlogFields & { slug: string; content: string; readingTime: string };
export type BlogSummary = Omit<BlogEntry, "content" | "status">;
export type CraftEntry = CraftFields & { slug: string; content: string };
export type CraftSummary = Omit<CraftEntry, "content" | "status">;
/** The quote is the file's body. */
export type TestimonialEntry = TestimonialFields & { slug: string; content: string };
export type TestimonialSummary = Omit<TestimonialEntry, "status">;
