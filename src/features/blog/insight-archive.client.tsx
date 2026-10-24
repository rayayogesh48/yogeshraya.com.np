"use client";

import { Search, X } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import type { BlogSummary } from "@/content/types";
import { InsightRow } from "./insight-list";
import { formatMonth } from "./format-date";

type Order = "latest" | "oldest";

/** The Insights archive: Latest/Oldest tabs, an optional search, and posts grouped under month headings. */
export function InsightArchive({ posts }: { posts: BlogSummary[] }) {
  const [order, setOrder] = useState<Order>("latest");
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchId = useId();

  const groups = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matches = posts.filter((post) => words.every((word) => `${post.title} ${post.description}`.toLowerCase().includes(word)));
    const sorted = [...matches].sort((a, b) => (order === "latest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
    const byMonth = new Map<string, BlogSummary[]>();
    for (const post of sorted) {
      const month = formatMonth(post.date);
      byMonth.set(month, [...(byMonth.get(month) ?? []), post]);
    }
    return [...byMonth];
  }, [posts, order, query]);

  const toggleSearch = () => {
    if (searching) {
      setQuery("");
      setSearching(false);
      return;
    }
    setSearching(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div className="archive">
      <div className="archive-toolbar">
        {searching ? (
          <label className="archive-search" htmlFor={searchId}>
            <Search size={15} aria-hidden="true" />
            <span className="sr-only">Search insights</span>
            <input
              ref={inputRef}
              id={searchId}
              type="search"
              placeholder="Search insights"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === "Escape" && toggleSearch()}
            />
          </label>
        ) : (
          <div className="archive-tabs" role="group" aria-label="Sort insights">
            {(["latest", "oldest"] as const).map((value) => (
              <button type="button" key={value} aria-pressed={order === value} onClick={() => setOrder(value)}>
                {value === "latest" ? "Latest" : "Oldest"}
              </button>
            ))}
          </div>
        )}
        <button type="button" className="archive-search-toggle" onClick={toggleSearch} aria-label={searching ? "Close search" : "Search insights"} aria-expanded={searching}>
          {searching ? <X size={17} aria-hidden="true" /> : <Search size={17} aria-hidden="true" />}
        </button>
      </div>

      <p className="sr-only" role="status">
        {query ? `${groups.reduce((count, [, items]) => count + items.length, 0)} insights match “${query}”` : ""}
      </p>

      {groups.length ? (
        groups.map(([month, items]) => (
          <section key={month} className="archive-month" aria-label={month}>
            <h2 className="archive-month-label">{month}</h2>
            <div className="insights-list">
              {items.map((post) => (
                <article className="insights-item" key={post.slug}>
                  <InsightRow post={post} titleAs="h3" compactDate />
                </article>
              ))}
            </div>
          </section>
        ))
      ) : (
        <p className="archive-empty">{query ? `No insights match “${query}”.` : "Insights coming soon."}</p>
      )}
    </div>
  );
}
