import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { assertUniqueSlugs, getWork, listBlogBySlugs, listWork } from "../../src/content/catalog";
import { workSummary } from "../../src/content/projections";

const roots: string[] = [];
function fixture(files: Record<string, string>, collection = "work") {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-content-"));
  roots.push(root);
  const directory = path.join(root, "content", collection);
  fs.mkdirSync(directory, { recursive: true });
  for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(directory, name), content);
  return root;
}
const work = (status: string, order: number) => `---\ntitle: Sample\nseoTitle: null\ntimeline: null\ndescription: null\nupdated: null\ngallery: null\nrelatedInsights: null\nsummary: Test\nrole: Designer\ntags: []\nkind: showcase\nstatus: ${status}\nfeaturedOrder: ${order}\ncover: null\n---\nBody`;
afterEach(() => roots.splice(0).forEach((root) => fs.rmSync(root, { recursive: true, force: true })));

describe("work catalog", () => {
  it("uses one publication rule and stable featured ordering", () => {
    const root = fixture({ "later.md": work("published", 2), "draft.md": work("draft", 1), "first.md": work("published", 1) });
    expect(listWork(root).map(({ slug }) => slug)).toEqual(["first", "later"]);
    expect(getWork("draft", root)).toBeUndefined();
    expect(getWork("first", root)?.title).toBe("Sample");
    const summary = workSummary(getWork("first", root)!);
    expect(summary).not.toHaveProperty("content");
    expect(summary).not.toHaveProperty("status");
    expect(summary).not.toHaveProperty("relatedInsights");
  });

  it("rejects case-insensitive duplicate slugs", () => {
    expect(() => assertUniqueSlugs(["same", "Same"], "work")).toThrow(/Duplicate work slug/);
  });

  it("fails a missing published asset", () => {
    const root = fixture({ "sample.md": work("published", 1).replace("cover: null\n---\nBody", "cover:\n  src: /images/missing.webp\n  alt: Preview\n  width: 800\n  height: 600\n---\nBody") });
    expect(() => listWork(root)).toThrow(/missing local asset/);
  });
});

const article = (status: string, date: string) => `---\ntitle: Article ${date}\ndescription: Test\ndate: "${date}"\nupdated: null\ncover: null\ncoverAlt: null\nstatus: ${status}\n---\nBody`;

describe("related insights", () => {
  it("keeps the requested order and skips drafts and unknown slugs", () => {
    const root = fixture({
      "newer.md": article("published", "2026-09-01"),
      "older.md": article("published", "2026-01-01"),
      "unfinished.md": article("draft", "2026-05-01"),
    }, "blog");
    expect(listBlogBySlugs(["older", "unfinished", "missing", "newer"], root).map(({ slug }) => slug)).toEqual(["older", "newer"]);
    expect(listBlogBySlugs([], root)).toEqual([]);
  });
});
