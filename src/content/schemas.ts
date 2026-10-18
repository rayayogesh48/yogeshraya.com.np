import { z } from "zod";

const nonempty = z.string().trim().min(1);
const localImage = z.object({
  src: z.string().startsWith("/images/"),
  alt: nonempty,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
}).strict();

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a quoted YYYY-MM-DD date").refine(
  (value) => !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value,
  "Date must exist on the calendar",
);

const status = z.enum(["draft", "published"]);

export const workSchema = z.object({
  title: nonempty,
  summary: nonempty,
  /** Search-result title when it should differ from the on-page title; falls back to `title`. */
  seoTitle: nonempty.max(70, "Keep search titles under 70 characters").optional(),
  /** Search-result description (about 150 characters); falls back to `summary`. */
  description: nonempty.max(170, "Keep search descriptions under 170 characters").optional(),
  /** Last meaningful edit, for the sitemap and structured data. */
  updated: date.optional(),
  role: nonempty,
  timeline: nonempty.optional(),
  tags: z.array(nonempty).default([]),
  kind: z.enum(["case-study", "showcase"]),
  status,
  featuredOrder: z.number().int().positive().optional(),
  cover: localImage.optional(),
  gallery: z.array(localImage).refine(
    (images) => new Set(images.map((image) => image.src)).size === images.length,
    "Gallery images must have unique sources",
  ).optional(),
  /** Blog slugs, in display order, shown as "Related insights" on the case study. */
  relatedInsights: z.array(z.string().regex(/^[\w-]+$/, "Use a blog slug such as designing-clearer-product-flows")).refine(
    (slugs) => new Set(slugs).size === slugs.length,
    "Related insights must not repeat a slug",
  ).optional(),
}).strict();

export const blogSchema = z.object({
  title: nonempty,
  description: nonempty,
  date,
  /** Last meaningful edit after publishing, for the sitemap and structured data. */
  updated: date.optional(),
  status,
  cover: z.string().startsWith("/images/").optional(),
  coverAlt: nonempty.optional(),
}).strict().refine((value) => !value.cover || Boolean(value.coverAlt), {
  path: ["coverAlt"],
  message: "A cover needs alt text",
});

export const craftSchema = z.object({
  title: nonempty,
  description: nonempty,
  category: z.enum(["Product UI", "Website Design", "Components"]),
  image: localImage,
  date: date.optional(),
  status,
}).strict();

export const testimonialSchema = z.object({
  name: nonempty,
  company: nonempty,
  /** Optional job title, shown before the company. */
  role: nonempty.optional(),
  /** Square photo under /images/testimonials/; initials show when it's missing. */
  image: z.string().startsWith("/images/").optional(),
  /** Company logo under /images/ (square or wide, SVG or image), shown beside the author. */
  companyLogo: z.string().startsWith("/images/").optional(),
  /** Lower numbers show first. */
  order: z.number().int().positive().optional(),
  /** Placeholder content: shown with a "Sample" badge in development, never included in production builds. */
  sample: z.boolean().optional(),
  status,
}).strict();

export type WorkFields = z.infer<typeof workSchema>;
export type BlogFields = z.infer<typeof blogSchema>;
export type CraftFields = z.infer<typeof craftSchema>;
export type TestimonialFields = z.infer<typeof testimonialSchema>;
