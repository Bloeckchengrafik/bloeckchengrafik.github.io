# Bloeckchengrafik

The site is built with Astro 7. The homepage follows the selected notebook concept in [`idea/`](idea/index.html); the other visual directions have been retired.

## Development

Use Node.js 22 or newer and pnpm 10:

```sh
pnpm install
pnpm dev
```

Run `pnpm build` to check and build the static site. The output is in `dist/`.

The homepage is in `src/pages/index.astro`. Shared page structure and metadata live in `src/layouts/SiteLayout.astro`; the notebook styles are in `src/styles/notebook-*.css`. Blog posts remain in `src/content/blog/`, with the collection defined in `src/content.config.ts`. The RSS feed is served at `/rss.xml`.

The selected concept in `idea/` remains a static design reference. Its appearance switch is for comparing the prototype palettes; the Astro site uses the selected light palette. The homepage features the newest article by `pubDate`, unless an article has `featured: true` in its frontmatter. Lab Notes with a `pubDate` appear newest-first; the homepage shows the two most recent dated notes. Undated notes remain in the archive.
