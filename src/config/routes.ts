/** Articles live in `content/blog` but are published as Insights under this path. */
export const insightsPath = "/insight";
export const insightPath = (slug: string) => `${insightsPath}/${slug}`;
