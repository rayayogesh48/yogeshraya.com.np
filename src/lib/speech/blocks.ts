import "server-only";
import { createHash } from "node:crypto";
import { toString } from "mdast-util-to-string";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { Nodes, RootContent } from "mdast";

/** One speakable unit of an article; `hash` pins cached audio to this exact text. */
export type SpeechBlock = { text: string; hash: string };
export type SpeechSource = { kind: "insight" | "work"; slug: string; blocks: SpeechBlock[] };

const MAX_BLOCK_CHARS = 1800;

const clean = (text: string) => text.replace(/\s+/g, " ").trim();
const block = (text: string): SpeechBlock => ({ text, hash: createHash("sha256").update(text).digest("hex").slice(0, 12) });

/** Splits text longer than one request comfortably handles at sentence boundaries. */
function chunk(text: string): string[] {
  if (text.length <= MAX_BLOCK_CHARS) return [text];
  const sentences = text.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) ?? [text];
  const parts: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (current && (current + sentence).length > MAX_BLOCK_CHARS) {
      parts.push(current.trim());
      current = "";
    }
    current += sentence;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/** Headings, paragraphs, list items and quotes in reading order. Code, tables, images and video are skipped. */
function collect(node: Nodes, out: string[]) {
  switch (node.type) {
    case "heading":
    case "paragraph": {
      const onlyMedia = node.type === "paragraph" && node.children.every((child) => child.type === "image" || (child.type === "text" && !child.value.trim()));
      if (!onlyMedia) out.push(clean(toString(node)));
      return;
    }
    case "listItem":
      out.push(clean(toString(node)));
      return;
    case "code":
    case "table":
    case "html":
    case "thematicBreak":
      return;
    default:
      if ("children" in node) for (const child of node.children as RootContent[]) collect(child, out);
  }
}

export function speechBlocks(title: string, markdown: string): SpeechBlock[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const texts: string[] = [clean(title)];
  collect(tree, texts);
  return texts.filter(Boolean).flatMap(chunk).map(block);
}
