import path from "node:path";
import fs from "node:fs";
import { readCollection } from "./filesystem";
import { parseContent } from "./parse";
import { isPublished, sortBlog, sortCraft, sortTestimonials, sortWork } from "./policy";
import type { BlogEntry, Collection, ContentRecord, CraftEntry, TestimonialEntry, WorkEntry } from "./types";

export function assertUniqueSlugs(slugs: string[], collection: Collection) {
  const seen = new Set<string>();
  for (const slug of slugs) {
    const key = slug.toLowerCase();
    if (seen.has(key)) throw new Error(`Duplicate ${collection} slug: ${slug}`);
    seen.add(key);
  }
}

function checkAssets(entry: ContentRecord, filename: string, root: string) {
  const assets = "summary" in entry
    ? [entry.cover?.src, ...(entry.gallery?.map((image) => image.src) ?? [])]
    : "readingTime" in entry ? [entry.cover]
    : "company" in entry ? [entry.image, entry.companyLogo]
    : [entry.image.src];
  for (const asset of assets.filter((item): item is string => Boolean(item))) {
    const resolved = path.resolve(root, "public", `.${asset}`);
    if (!resolved.startsWith(path.resolve(root, "public") + path.sep) || !fs.existsSync(resolved)) {
      throw new Error(`Invalid content in ${filename}: missing local asset ${asset}`);
    }
  }
}

function entries(collection: "work", root?: string): WorkEntry[];
function entries(collection: "blog", root?: string): BlogEntry[];
function entries(collection: "craft", root?: string): CraftEntry[];
function entries(collection: "testimonials", root?: string): TestimonialEntry[];
function entries(collection: Collection, root = process.cwd()): ContentRecord[] {
  const files = readCollection(collection, root);
  assertUniqueSlugs(files.map(({ slug }) => slug), collection);
  return files.map(({ slug, filename, raw }) => {
    const entry = parseContent(collection, slug, filename, raw);
    if (isPublished(entry)) checkAssets(entry, filename, root);
    return entry;
  });
}

export function listWork(root?: string): WorkEntry[] { return sortWork(entries("work", root).filter(isPublished)); }
export function listBlog(root?: string): BlogEntry[] { return sortBlog(entries("blog", root).filter(isPublished)); }
export function listCraft(root?: string): CraftEntry[] { return sortCraft(entries("craft", root).filter(isPublished)); }
/** Sample testimonials are for local previews only, so a placeholder quote can never ship as a real review. */
export function listTestimonials(root?: string): TestimonialEntry[] {
  const production = process.env.NODE_ENV === "production";
  return sortTestimonials(entries("testimonials", root).filter((entry) => isPublished(entry) && !(production && entry.sample)));
}
export function getWork(slug: string, root?: string) { return listWork(root).find((entry) => entry.slug === slug); }
export function getBlog(slug: string, root?: string) { return listBlog(root).find((entry) => entry.slug === slug); }
export function getCraft(slug: string, root?: string) { return listCraft(root).find((entry) => entry.slug === slug); }
/** Published articles for the given slugs, in the given order; drafts and unknown slugs are skipped. */
export function listBlogBySlugs(slugs: readonly string[], root?: string): BlogEntry[] {
  const published = new Map(listBlog(root).map((entry) => [entry.slug, entry]));
  return slugs.flatMap((slug) => published.get(slug) ?? []);
}
export function validateCatalog(root?: string) {
  return { work: entries("work", root), blog: entries("blog", root), craft: entries("craft", root), testimonials: entries("testimonials", root) };
}
