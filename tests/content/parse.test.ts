import { describe, expect, it } from "vitest";
import { parseContent } from "../../src/content/parse";

describe("content parser", () => {
  it("rejects missing status and identifies the file", () => {
    expect(() => parseContent("work", "sample", "sample.md", "---\ntitle: Sample\nsummary: Test\nrole: Designer\ntags: []\nkind: showcase\n---\nBody"))
      .toThrow(/sample\.md.*status/);
  });

  it("rejects a published project without a story", () => {
    expect(() => parseContent("work", "sample", "sample.md", "---\ntitle: Sample\nsummary: Test\nrole: Designer\ntags: []\nkind: showcase\nstatus: published\n---\n"))
      .toThrow(/needs a story/);
  });

  it("rejects an impossible publication date", () => {
    expect(() => parseContent("blog", "sample", "sample.md", "---\ntitle: Sample\ndescription: Test\ndate: \"2026-02-30\"\nstatus: published\n---\nBody"))
      .toThrow(/date/);
  });

  it("rejects repeated related insight slugs", () => {
    expect(() => parseContent("work", "sample", "sample.md", "---\ntitle: Sample\nsummary: Test\nrole: Designer\ntags: []\nkind: showcase\nstatus: draft\nrelatedInsights: [a, a]\n---\n"))
      .toThrow(/must not repeat/);
  });
});
