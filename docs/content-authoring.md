# Content authoring

Create one Markdown file in `content/work`, `content/blog`, or `content/craft`. Its filename becomes the route slug. Use `status: draft` while editing and `status: published` when ready. Run `npm run content:check` before a build. The validator reports the filename and invalid field or missing local image.

Work entries require `title`, `summary`, `role`, `tags`, `kind: case-study | showcase`, `status`, and a story body when published. `timeline`, `featuredOrder`, `cover`, `gallery`, and `relatedInsights` are optional. A positive `featuredOrder` includes the project on Home and orders it there. Images use `src`, `alt`, `width`, and `height`; paths start with `/images/` and point to files in `public/images`.

`relatedInsights` lists blog slugs (filenames in `content/blog` without `.md`) in the order they should appear under **Related insights** at the end of the case study. Titles, descriptions, and links come from the articles themselves. Draft articles are skipped until published, the section is hidden when nothing is left to show, and `npm run content:check` fails on a slug that does not exist.

The work card uses `gallery` when it contains images, or `cover` as a single image. Add distinct, real project screenshots to `gallery` to enable the carousel. A single image shows no navigator. Do not duplicate a cover merely to display carousel controls.

```md
---
title: "Project title"
summary: "A verified summary of the problem and work."
role: "Product Designer"
tags:
  - "Product Design"
kind: "case-study"
status: "draft"
featuredOrder: 1
relatedInsights:
  - "designing-clearer-product-flows"
---

The project story goes here.
```

Blog entries require `title`, `description`, a **quoted** `YYYY-MM-DD` publication `date`, `status`, and a body when published. `cover` and its `coverAlt` are optional together. Craft entries require `title`, `description`, `category` (`Product UI`, `Website Design`, or `Components`), `image` with dimensions and alt text, and `status`; `date` is optional. The six current Craft entries are placeholders to replace with real work. Profile and experience remain typed records in `content/site`.

Do not place confidential draft artwork under `public/`: those files are directly reachable even when their content route is unpublished.
