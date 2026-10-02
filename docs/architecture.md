# Portfolio architecture

This is one Next.js 15 App Router application and one deployment. It uses React 19, TypeScript, Tailwind CSS 4, Motion, local Markdown content, and no database or CMS. The current public routes are `/`, `/work`, `/work/[slug]`, `/about`, `/craft`, `/craft/[slug]`, `/insight`, and `/insight/[slug]` (articles are stored in `content/blog`; `/blog` URLs redirect to `/insight`).

`src/app` handles URLs, static params, metadata, and not-found behavior. Page layouts live in `src/features`. Reusable controls, media, Markdown, motion, the site shell, and theme behavior live in `src/components`. `content/site` holds typed profile and experience data; `content/work`, `content/blog`, and `content/craft` hold authored Markdown. `src/content` owns file discovery, parsing, schemas, publication policy, and public projections. Only routes import `src/content/server.ts`; UI receives typed props.

Each work entry has one Markdown file with metadata and story together. The filename is its URL slug. Blog and craft use the same catalog pipeline with separate schemas. `status: published` is required for public lists, details, static params, metadata, home sections, and sitemap. Invalid published content fails the content check and build. An unpublished project story is retained as a draft.

The root layout loads the design tokens, base styles, shared component styles, home styles, and site chrome once. Project card, gallery, and Markdown visuals live in CSS Modules. The dark Figma design remains the default; light and system preferences persist across visits and tabs. Browser state remains local to small Client Components. Essential text and Markdown render on the server.

`NEXT_PUBLIC_SITE_URL` sets canonical URLs. Indexing requires `VERCEL_ENV=production` and an HTTPS origin. Preview/local builds remain noindex with an empty sitemap. Published routes are prerendered with `generateStaticParams` and `dynamicParams = false`; deployment still uses the normal `next build`/`next start` server workflow.

Verification is `npm run check` followed by `npm run test:e2e`. The first command runs ESLint, content validation, content unit tests, production build, and TypeScript. CI runs the same checks with Chromium browser tests. See [content authoring](content-authoring.md) for new entries.
