import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { aboutData, strengths } from "../content/site/profile";
import { experiences } from "../content/site/experience";
import { validateCatalog } from "../src/content/catalog";

const nonempty = z.string().trim().min(1);
const profileSchema = z.object({
  name: nonempty, role: nonempty, headline: nonempty, intro: nonempty,
  approach: nonempty, email: z.union([z.literal(""), z.email()]),
  resume: z.string().startsWith("/").optional(),
  portrait: z.string().startsWith("/").optional(),
  socials: z.object({ linkedin: z.url().optional(), github: z.url().optional(), twitter: z.url().optional() }),
});
const experienceSchema = z.array(z.object({
  company: nonempty, role: nonempty, period: nonempty,
  location: nonempty.optional(), logo: z.string().startsWith("/").optional(), summary: nonempty.optional(),
  contributions: z.array(nonempty).min(1),
  caseStudySlug: nonempty.optional(),
}));

const catalog = validateCatalog();
profileSchema.parse(aboutData);
for (const asset of [aboutData.portrait, aboutData.resume].filter((value): value is string => Boolean(value))) {
  if (!fs.existsSync(path.join(process.cwd(), "public", asset))) throw new Error(`Profile references missing asset ${asset}`);
}
z.array(z.object({ title: nonempty, description: nonempty })).parse(strengths);
experienceSchema.parse(experiences);

const publishedWork = new Set(catalog.work.filter((item) => item.status === "published").map((item) => item.slug));
const publishedBlog = new Set(catalog.blog.filter((item) => item.status === "published").map((item) => item.slug));
const publishedCraft = new Set(catalog.craft.filter((item) => item.status === "published").map((item) => item.slug));
const knownBlog = new Set(catalog.blog.map((item) => item.slug));
for (const study of catalog.work) {
  for (const slug of study.relatedInsights ?? []) {
    if (!knownBlog.has(slug)) throw new Error(`work/${study.slug}: relatedInsights references missing article ${slug}`);
  }
}
for (const role of experiences) {
  if (role.logo && !fs.existsSync(path.join(process.cwd(), "public", role.logo))) {
    throw new Error(`Experience ${role.company} references missing logo ${role.logo}`);
  }
  if (role.caseStudySlug && !publishedWork.has(role.caseStudySlug)) {
    throw new Error(`Experience ${role.company} references unpublished or missing work: ${role.caseStudySlug}`);
  }
}

for (const [collection, entries] of Object.entries(catalog)) {
  for (const entry of entries) {
    if (entry.status !== "published") continue;
    for (const match of entry.content.matchAll(/\/(?:images|videos)\/[\w./-]+/g)) {
      const asset = match[0];
      if (!fs.existsSync(path.join(process.cwd(), "public", asset))) {
        throw new Error(`${collection}/${entry.slug}: missing referenced media ${asset}`);
      }
    }
    for (const match of entry.content.matchAll(/\]\(\/(work|insight|craft)\/([\w-]+)(?:#[\w-]+)?\)/g)) {
      const [, target, slug] = match;
      const slugs = target === "work" ? publishedWork : target === "insight" ? publishedBlog : publishedCraft;
      if (!slugs.has(slug)) throw new Error(`${collection}/${entry.slug}: link to missing or unpublished ${target}/${slug}`);
    }
  }
}

console.log(`Content valid: ${catalog.work.filter((item) => item.status === "published").length} work, ${catalog.blog.filter((item) => item.status === "published").length} blog, ${catalog.craft.filter((item) => item.status === "published").length} craft published.`);
