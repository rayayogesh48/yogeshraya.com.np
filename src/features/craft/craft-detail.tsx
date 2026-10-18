import { aboutData } from "@site/profile";
import { CraftViewer } from "./craft-viewer.client";
import type { CraftSummary } from "@/content/types";

export function CraftDetail({ item, items }: { item: CraftSummary; items: CraftSummary[] }) {
  const index = items.findIndex((entry) => entry.slug === item.slug);
  const prev = index > 0 ? items[index - 1] : undefined;
  const next = index >= 0 && index < items.length - 1 ? items[index + 1] : undefined;
  const related = items
    .filter((entry) => entry.slug !== item.slug)
    .sort(
      (a, b) =>
        Number(b.category === item.category) -
        Number(a.category === item.category),
    )
    .slice(0, 4);
  const avatar = aboutData.portraitSizes?.[0]?.src ?? aboutData.portrait;
  return (
    <CraftViewer
      item={item}
      prev={prev}
      next={next}
      related={related}
      author={{ name: aboutData.name, avatar }}
    />
  );
}
