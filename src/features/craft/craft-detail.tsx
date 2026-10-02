import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CraftCollection } from "@/features/craft/craft-collection.client";
import { formatDate } from "@/features/blog/format-date";
import type { CraftSummary } from "@/content/types";

export function CraftDetail({ item, items }: { item: CraftSummary; items: CraftSummary[] }) {
  const related = items
    .filter((entry) => entry.slug !== item.slug)
    .sort(
      (a, b) =>
        Number(b.category === item.category) -
        Number(a.category === item.category),
    )
    .slice(0, 2);
  return (
    <article className="page-width subpage">
      <Link className="text-link back-link" href="/craft">
        <ArrowLeft size={15} />
        Back to Craft
      </Link>
      <img
        className="craft-artwork"
        src={item.image.src}
        alt={item.image.alt}
        width={item.image.width}
        height={item.image.height}
      />
      <header className="page-heading">
        <div className="article-meta">
          <span>{item.category}</span>
          {item.date && <time dateTime={item.date}>{formatDate(item.date)}</time>}
        </div>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
      </header>
      {related.length > 0 && (
        <section className="section">
          <h2>More to explore</h2>
          <CraftCollection items={related} preview />
        </section>
      )}
      <Link className="text-link" href="/craft">
        <ArrowLeft size={15} />
        Back to Craft
      </Link>
    </article>
  );
}
