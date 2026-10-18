import { describe, expect, it } from "vitest";
import { parseContent } from "../../src/content/parse";

const optionalKeys = ["seoTitle", "timeline", "description", "updated", "cover", "gallery", "featuredOrder", "relatedInsights"];
/** Work frontmatter lists every key, so fixtures fill the ones they don't set with null. */
const nulls = (...skip: string[]) => optionalKeys.filter((key) => !skip.includes(key)).map((key) => `${key}: null\n`).join("");

describe("content parser", () => {
  it("rejects missing status and identifies the file", () => {
    expect(() => parseContent("work", "sample", "sample.md", `---\ntitle: Sample\nsummary: Test\nrole: Designer\ntags: []\nkind: showcase\n${nulls()}---\nBody`))
      .toThrow(/sample\.md.*status/);
  });

  it("rejects a published project without a story", () => {
    expect(() => parseContent("work", "sample", "sample.md", `---\ntitle: Sample\nsummary: Test\nrole: Designer\ntags: []\nkind: showcase\nstatus: published\n${nulls()}---\n`))
      .toThrow(/needs a story/);
  });

  it("requires every work key and accepts null for missing data", () => {
    expect(() => parseContent("work", "sample", "sample.md", "---\ntitle: Sample\nsummary: Test\nrole: Designer\ntags: null\nkind: showcase\nstatus: draft\n---\n"))
      .toThrow(/Missing frontmatter keys: seoTitle/);
    const entry = parseContent("work", "sample", "sample.md", `---\ntitle: Sample\nsummary: Test\nrole: Designer\ntags: null\nkind: showcase\nstatus: draft\n${nulls()}---\n`);
    expect(entry.tags).toEqual([]);
    expect(entry.cover).toBeUndefined();
  });

  it("rejects an impossible publication date", () => {
    expect(() => parseContent("blog", "sample", "sample.md", "---\ntitle: Sample\ndescription: Test\ndate: \"2026-02-30\"\nupdated: null\ncover: null\ncoverAlt: null\nstatus: published\n---\nBody"))
      .toThrow(/date: Date must exist/);
  });

  it("rejects repeated related insight slugs", () => {
    expect(() => parseContent("work", "sample", "sample.md", `---\ntitle: Sample\nsummary: Test\nrole: Designer\ntags: []\nkind: showcase\nstatus: draft\nrelatedInsights: [a, a]\n${nulls("relatedInsights")}---\n`))
      .toThrow(/must not repeat/);
  });
});
