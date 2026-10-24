"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; title: string };

/**
 * A slim "on this page" rail beside long articles on wide screens: one line per section that expands into the
 * section titles on hover or keyboard focus. The current section is highlighted while reading.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  // Only shown while the article body fills the reading area, so it never sits over the end-of-article sections.
  const [inArticle, setInArticle] = useState(true);

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id)).filter((element): element is HTMLElement => Boolean(element));
    if (!headings.length) return;
    const body = document.querySelector(".article-body");
    const update = () => {
      const bounds = body?.getBoundingClientRect();
      if (bounds) setInArticle(bounds.bottom > window.innerHeight * 0.5 && bounds.top < window.innerHeight);
      const line = window.innerHeight * 0.3;
      let current = headings[0].id;
      for (const heading of headings) if (heading.getBoundingClientRect().top <= line) current = heading.id;
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [items]);

  if (items.length < 2) return null;
  return (
    <nav className="toc" aria-label="On this page" data-hidden={inArticle ? undefined : ""}>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}>
              <span className="toc-line" aria-hidden="true" />
              <span className="toc-title">{item.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
