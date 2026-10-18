import { notFound } from "next/navigation";
import { craftEnabled } from "@/config/features";
import { listPublishedCraft } from "@/content/server";
import { CraftPageContent } from "@/features/craft/craft-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Craft & Interface Explorations",
  "Interface details, website explorations, and small design studies by Yogesh Raya.",
  "/craft",
);
export default function Page() {
  if (!craftEnabled) notFound();
  return <CraftPageContent items={listPublishedCraft()} />;
}
