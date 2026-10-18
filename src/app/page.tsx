import { HomePage } from "@/features/home/home-page";
import { listPublishedBlogPosts, listPublishedTestimonials, listPublishedWork } from "@/content/server";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, personSchema, websiteSchema } from "@/lib/structured-data";

export const metadata = pageMetadata(
  "Product Designer in Nepal",
  "Explore Yogesh Raya’s product design portfolio: UX case studies, client projects, website designs, and practical thoughts on solving user problems.",
  "/",
);
metadata.title = { absolute: "Yogesh Raya | Product Designer in Nepal" };

export default function Page() {
  return (
    <>
      <JsonLd data={[personSchema(), websiteSchema()]} />
      <HomePage work={listPublishedWork()} testimonials={listPublishedTestimonials()} posts={listPublishedBlogPosts()} />
    </>
  );
}
