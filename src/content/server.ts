import "server-only";
import { getBlog, getCraft, getWork, listBlog, listBlogBySlugs, listCraft, listTestimonials, listWork } from "./catalog";
import { blogSummary, craftSummary, workSummary } from "./projections";
import type { WorkEntry } from "./types";

export function listPublishedWork() { return listWork().map(workSummary); }
export function getPublishedWork(slug: string) { return getWork(slug); }
export function listPublishedBlogPosts() { return listBlog().map(blogSummary); }
export function getPublishedBlogPost(slug: string) { return getBlog(slug); }
export function listRelatedInsights(study: Pick<WorkEntry, "relatedInsights">) { return listBlogBySlugs(study.relatedInsights ?? []).map(blogSummary); }
export function listPublishedCraft() { return listCraft().map(craftSummary); }
export function getPublishedCraft(slug: string) { return getCraft(slug); }
export function listPublishedTestimonials() { return listTestimonials().map(({ status, ...entry }) => { void status; return entry; }); }
