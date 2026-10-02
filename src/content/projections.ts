import type { BlogEntry, BlogSummary, CraftEntry, CraftSummary, WorkEntry, WorkSummary } from "./types";

export function workSummary({ content, status, relatedInsights, ...summary }: WorkEntry): WorkSummary { void content; void status; void relatedInsights; return summary; }
export function blogSummary({ content, status, ...summary }: BlogEntry): BlogSummary { void content; void status; return summary; }
export function craftSummary({ content, status, ...summary }: CraftEntry): CraftSummary { void content; void status; return summary; }
