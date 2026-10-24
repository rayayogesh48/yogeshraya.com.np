import "server-only";
import { toString } from "mdast-util-to-string";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { headingId } from "@/components/markdown/markdown";

/** Top-level sections (Markdown `#`/`##`) for the table of contents, using the same ids the renderer gives them. */
export function articleSections(markdown: string) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  return tree.children.flatMap((node) => (node.type === "heading" && node.depth <= 2 ? [{ id: headingId(toString(node)), title: toString(node) }] : []));
}
