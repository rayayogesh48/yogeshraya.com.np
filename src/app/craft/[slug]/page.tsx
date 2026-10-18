import { notFound } from "next/navigation";
import { craftEnabled } from "@/config/features";
import { getPublishedCraft, listPublishedCraft } from "@/content/server";
import { CraftDetail } from "@/features/craft/craft-detail";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return craftEnabled ? listPublishedCraft().map(({ slug }) => ({ slug })) : [];
}
export async function generateMetadata({ params }: Props) {
  const item = craftEnabled ? getPublishedCraft((await params).slug) : undefined;
  if (!item) notFound();
  return pageMetadata(item.title, item.description, `/craft/${item.slug}`);
}
export default async function Page({ params }: Props) {
  const item = craftEnabled ? getPublishedCraft((await params).slug) : undefined;
  if (!item) notFound();
  return <CraftDetail item={item} items={listPublishedCraft()} />;
}
