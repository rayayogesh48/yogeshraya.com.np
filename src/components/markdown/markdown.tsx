import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import styles from "./markdown.module.css";

type HastNode = { type: string; value?: string; children?: HastNode[] };
const textOf = (node?: HastNode): string => (node?.type === "text" ? (node.value ?? "") : (node?.children ?? []).map(textOf).join(""));
/** Stable heading ids ("the-problem") so the table of contents and shared links can point at sections. */
export const headingId = (text: string) =>
  text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "section";

export function MarkdownContent({ content, className = "" }: { content: string; className?: string }) {
  return (
    <div className={`prose ${styles.prose} ${className}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h1: ({ node, children }) => <h2 id={headingId(textOf(node as HastNode))}>{children}</h2>,
          h2: ({ node, children }) => <h2 id={headingId(textOf(node as HastNode))}>{children}</h2>,
          a: ({ href, children }) =>
            !href ? (
              <span>{children}</span>
            ) : href.startsWith("/") || href.startsWith("#") ? (
              <Link href={href}>{children}</Link>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          table: ({ children }) => (
            <div
              className={`table-scroll ${styles.tableScroll}`}
              tabIndex={0}
              role="region"
              aria-label="Article table"
            >
              <table>{children}</table>
            </div>
          ),
          pre: ({ children }) => (
            <pre tabIndex={0} aria-label="Code example">
              {children}
            </pre>
          ),
          // An image or video alone in a paragraph becomes a figure, which can't sit inside <p>.
          p: ({ node, children }) => {
            const only = node?.children.length === 1 ? node.children[0] : undefined;
            return only?.type === "element" && only.tagName === "img" ? <>{children}</> : <p>{children}</p>;
          },
          // `![alt](/path "Caption")`: the title becomes a visible caption; .mp4/.webm sources render as video.
          img: ({ src, alt, title }) => {
            const source = typeof src === "string" ? src : "";
            const media = /\.(mp4|webm)$/i.test(source) ? (
              <video src={source} controls muted loop playsInline preload="metadata" aria-label={alt || title || "Video"} />
            ) : (
              <img src={source} alt={alt || ""} width={800} height={450} loading="lazy" />
            );
            return (
              <figure className={styles.figure}>
                {media}
                {title && <figcaption>{title}</figcaption>}
              </figure>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
