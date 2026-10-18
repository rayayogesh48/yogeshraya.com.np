# Yogesh Raya — Product Design Portfolio

A narrow, responsive portfolio built with Next.js, React, TypeScript, Motion for React, and static Markdown. The interface is a single ~734px column of stacked sections with a floating dock: an interactive starfield banner, blur-in word reveals, draggable project carousels, an expanding experience timeline, a hover-to-reveal strengths list, a particle-star About section, and a footer with local time. Dark is the initial theme; saved Light/System choices still work. The grey text is a little lighter than the original design so it meets WCAG AA contrast. Earlier [Figma implementation notes](docs/figma-implementation.md) describe the previous design.

## Development

```sh
npm install
npm run dev
npm run check
```

The app includes Home, Work and case studies, About, Craft and artwork details, and Markdown articles published as Insights. Insights live at `/insight` and `/insight/[slug]`; old `/blog` URLs permanently redirect there.

## Content

- `content/site/`: typed profile, strengths, and verified experience records.
- `content/work/`: one Markdown file per project, with metadata and story together. The existing three public projects remain published; the previously unlisted story is an explicit draft.
- `content/blog/`: Markdown articles, shown as **Insights** at `/insight/...`. The feedback article remains a draft. Case studies can list related articles with `relatedInsights`.
- `content/craft/`: approved artwork can be added here; the collection is intentionally empty today.

All collections use `status: draft | published`. A single validated catalog supplies lists, details, home sections, metadata, static routes, and the sitemap. See [content authoring](docs/content-authoring.md) for required fields and examples.

```md
---
title: "Article title"
description: "A concise summary."
date: "2026-09-24"
status: "draft"
---

Article content.
```

## Deployment and discovery

Google Analytics (GA4, `G-EBNBQG6GZ8`) loads only on the Vercel production site; set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to use a different property.

Optionally set `GOOGLE_SITE_VERIFICATION` to the token from Google Search Console's HTML-tag method (not needed when the domain is verified through DNS). After launch, submit `/sitemap.xml` in Search Console.

Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS origin before a Vercel production build. Production builds fail if it is missing or invalid. Local and preview builds remain non-indexable. A configured origin can still provide canonical URLs in preview while those pages stay noindex.

Optional content is omitted or presented honestly: no invented email, resume link, portrait, visitor total, personal preferences, or Craft artwork. The initials avatar can be replaced through `aboutData.portrait`. A visitor counter should only be added when a real site-wide measurement source exists.

## Interactions and accessibility

- Dock with a sliding active pill and expanding label. On the home page it follows the section in view and scrolls to sections; elsewhere it links to pages. Settings expand inside the dock with System/Light/Dark persistence, Escape/outside dismissal with focus return, English, and a Nepali "coming soon" label.
- Experience entries and strengths use buttons with expanded state. Strengths preview on hover and pin on click or tap.
- Project carousels support drag/flick, arrow keys, buttons, dots, and an announced slide position. Projects without images show decorative mock screens; single images hide controls.
- When an email is configured, M copies it from any page (ignoring editable fields and modified shortcuts) and a toast confirms it.
- Motion respects reduced-motion preferences. Server-rendered primary text remains visible without JavaScript.

## Browser checks

```sh
npx playwright install chromium
npm run check
npm run test:home
# Full portfolio regression suite:
npm run test:e2e
```

Checks cover desktop/mobile layouts, carousels, dock section tracking, route navigation, light/dark accessibility (axe, no exceptions), theme persistence, settings focus, disclosures, draft/unknown-page 404s, readable server HTML, and dock clearance. Failure traces and browser reports go to ignored output folders.

See [architecture](docs/architecture.md), [the imported requirement brief](docs/portfolio-requirements.md), and [implementation notes](docs/implementation-notes.md) for structure, scope, and content-dependent states.
