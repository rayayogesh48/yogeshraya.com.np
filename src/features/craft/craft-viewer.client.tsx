"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, Info, Link2, X } from "lucide-react";
import { formatDate } from "@/features/blog/format-date";
import type { CraftSummary } from "@/content/types";

/** The info panel sits beside the piece on wide screens and opens there by default; narrower screens show it as a sheet on request. */
const WIDE = "(min-width: 1100px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function CraftViewer({
  item,
  prev,
  next,
  related,
  author,
}: {
  item: CraftSummary;
  prev?: CraftSummary;
  next?: CraftSummary;
  related: CraftSummary[];
  author: { name: string; avatar?: string };
}) {
  const router = useRouter();
  const wide = useSyncExternalStore(subscribe, () => window.matchMedia(WIDE).matches, () => false);
  // "auto" follows the screen width until the viewer toggles the panel.
  const [info, setInfo] = useState<"auto" | "open" | "closed">("auto");
  const [copied, setCopied] = useState(false);
  const open = info === "auto" ? wide : info === "open";

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key === "Escape") {
        if (open && !wide) setInfo("closed");
        else router.push("/craft");
      } else if (event.key === "ArrowLeft" && prev) router.push(`/craft/${prev.slug}`);
      else if (event.key === "ArrowRight" && next) router.push(`/craft/${next.slug}`);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, wide, prev, next, router]);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, url });
      } catch {
        // Dismissing the share sheet isn't an error worth surfacing.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the address bar still has the link.
    }
  }

  return (
    <div className="craft-viewer" data-info={info}>
      <header className="craft-viewer-bar">
        <div className="craft-viewer-start">
          <Link className="craft-viewer-icon" href="/craft" aria-label="Close, back to Craft">
            <X size={18} aria-hidden="true" />
          </Link>
          <Link className="craft-viewer-author" href="/about">
            {author.avatar && <img src={author.avatar} alt="" width={24} height={24} />}
            <span>{author.name}</span>
          </Link>
        </div>
        <h1 className="craft-viewer-title">{item.title}</h1>
        <span className="craft-viewer-end">{item.category}</span>
      </header>

      <div className="craft-viewer-body">
        <figure className="craft-viewer-stage">
          <img
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.width}
            height={item.image.height}
            fetchPriority="high"
          />
        </figure>

        <aside id="craft-info" className="craft-viewer-info" aria-label="About this piece" data-open={open}>
          <div className="craft-viewer-info-scroll">
            <p className="craft-viewer-info-title">{item.title}</p>
            <p className="craft-viewer-info-description">{item.description}</p>
            <dl className="craft-viewer-facts">
              <div>
                <dt>Category</dt>
                <dd>{item.category}</dd>
              </div>
              {item.date && (
                <div>
                  <dt>Published</dt>
                  <dd>
                    <time dateTime={item.date}>{formatDate(item.date)}</time>
                  </dd>
                </div>
              )}
            </dl>
            {related.length > 0 && (
              <section className="craft-viewer-more">
                <h2>More to explore</h2>
                <ul>
                  {related.map((entry) => (
                    <li key={entry.slug}>
                      <Link href={`/craft/${entry.slug}`}>
                        <img src={entry.image.src} alt="" width={entry.image.width} height={entry.image.height} loading="lazy" />
                        <span>{entry.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </aside>
      </div>

      <nav className="craft-viewer-actions" aria-label="Piece actions">
        {prev ? (
          <Link className="craft-viewer-icon" href={`/craft/${prev.slug}`} aria-label={`Previous: ${prev.title}`}>
            <ChevronLeft size={18} aria-hidden="true" />
          </Link>
        ) : (
          <span className="craft-viewer-icon" aria-hidden="true" data-disabled>
            <ChevronLeft size={18} />
          </span>
        )}
        <button
          type="button"
          className="craft-viewer-icon"
          aria-label="About this piece"
          aria-expanded={open}
          aria-controls="craft-info"
          onClick={() => setInfo(open ? "closed" : "open")}
        >
          <Info size={18} aria-hidden="true" />
        </button>
        <button type="button" className="craft-viewer-icon" aria-label="Share link" onClick={share}>
          <Link2 size={18} aria-hidden="true" />
        </button>
        {next ? (
          <Link className="craft-viewer-icon" href={`/craft/${next.slug}`} aria-label={`Next: ${next.title}`}>
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        ) : (
          <span className="craft-viewer-icon" aria-hidden="true" data-disabled>
            <ChevronRight size={18} />
          </span>
        )}
      </nav>
      <p className="craft-viewer-toast" role="status" data-visible={copied}>
        {copied ? "Link copied" : ""}
      </p>
    </div>
  );
}
