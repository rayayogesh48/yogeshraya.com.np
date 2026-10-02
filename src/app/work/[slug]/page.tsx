import { notFound } from "next/navigation";
import { getPublishedWork, listPublishedWork, listRelatedInsights } from "@/content/server";
import { WorkDetail } from "@/features/work/work-detail";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return listPublishedWork().map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const study = getPublishedWork((await params).slug);
  if (!study) notFound();
  return pageMetadata(study.title, study.summary, `/work/${study.slug}`);
}
export default async function Page({ params }: Props) {
  const study = getPublishedWork((await params).slug);
  if (!study) notFound();
  return <WorkDetail study={study} insights={listRelatedInsights(study)} />;
}
