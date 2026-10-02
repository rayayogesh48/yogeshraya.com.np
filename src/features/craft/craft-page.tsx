import { CraftCollection } from "./craft-collection.client";
import type { CraftSummary } from "@/content/types";

export function CraftPageContent({ items }: { items: CraftSummary[] }) {
  return (
    <div className="page-width subpage">
      <header className="page-heading">
        <h1>Craft</h1>
        <p>
          Interface details, website explorations, and small design studies. A
          space for the little things that make a product feel considered.
        </p>
      </header>
      <CraftCollection items={items} />
    </div>
  );
}
