import matter from "gray-matter";
import { ZodError } from "zod";
import { blogSchema, craftSchema, testimonialSchema, workSchema } from "./schemas";
import type { BlogEntry, Collection, ContentRecord, CraftEntry, TestimonialEntry, WorkEntry } from "./types";

export function parseContent(collection: "work", slug: string, filename: string, raw: string): WorkEntry;
export function parseContent(collection: "blog", slug: string, filename: string, raw: string): BlogEntry;
export function parseContent(collection: "craft", slug: string, filename: string, raw: string): CraftEntry;
export function parseContent(collection: "testimonials", slug: string, filename: string, raw: string): TestimonialEntry;
export function parseContent(collection: Collection, slug: string, filename: string, raw: string): ContentRecord;
export function parseContent(collection: Collection, slug: string, filename: string, raw: string): ContentRecord {
  try {
    const parsed = matter(raw);
    const content = parsed.content.trim();
    if (collection === "work") {
      const fields = workSchema.parse(parsed.data);
      if (fields.status === "published" && !content) throw new Error("Published work needs a story");
      return { ...fields, slug, content };
    }
    if (collection === "blog") {
      const fields = blogSchema.parse(parsed.data);
      if (fields.status === "published" && !content) throw new Error("Published blog post needs a body");
      const words = content ? content.split(/\s+/).length : 0;
      return { ...fields, slug, content, readingTime: `${Math.max(1, Math.ceil(words / 200))} min read` };
    }
    if (collection === "testimonials") {
      const fields = testimonialSchema.parse(parsed.data);
      if (fields.status === "published" && !content) throw new Error("Published testimonial needs a quote");
      return { ...fields, slug, content };
    }
    const fields = craftSchema.parse(parsed.data);
    return { ...fields, slug, content };
  } catch (error) {
    const detail = error instanceof ZodError
      ? error.issues.map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`).join("; ")
      : error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid content in ${filename}: ${detail}`);
  }
}
