# DevToolbox

Ad-supported hub of free, client-side developer tools. Built with Astro 7 + React 19 + Tailwind 4; every page is static HTML with a small React island for the interactive tool.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server at http://localhost:4321 |
| `pnpm build` | Generates OG images, then static build to `dist/` (also generates `sitemap-index.xml`) |
| `pnpm og` | Regenerate social-card PNGs only (`public/og.png`, `public/og/<slug>.png`) — add `--force` to redo all |
| `pnpm preview` | Serve `dist/` locally |
| `pnpm astro check` | Type-check `.astro` and `.tsx` files |

## Project layout

```
src/
  config.ts                 # Site name, URL, contact, ad settings  ← edit before deploying
  data/tools.ts             # Tool registry: metadata + SEO copy for every tool page
  layouts/Base.astro        # <head> (meta, canonical, OG, JSON-LD), header, footer
  components/
    AdSlot.astro            # AdSense unit, or a labelled placeholder while ads are disabled
    Header.astro / Footer.astro / ToolCard.astro
    ToolSearch.tsx          # Home-page search island
    tools/
      ui.tsx                # Shared primitives (Button, TextArea, CopyButton, …)
      <ToolName>.tsx        # One React component per tool
  lib/                      # Pure helpers (md5, case conversion) — unit-testable
  pages/
    index.astro             # Home
    tools/index.astro       # All tools
    tools/[slug].astro      # Generates /tools/<slug>/ for every entry in data/tools.ts
    about / contact / privacy / terms / 404
public/
  robots.txt, favicon.svg
scripts/
  og.mjs, fonts/            # Build-time Open Graph image generator (satori + resvg)
```

## Adding a tool

1. Create `src/components/tools/MyTool.tsx` (default-export a React component; use primitives from `ui.tsx`).
2. Add an entry to `TOOLS` in `src/data/tools.ts` — slug, name, description, keywords, `howTo`, `about`, `faq`, `related`. This copy is what ranks, so write it for a real reader.
3. Import the component in `src/pages/tools/[slug].astro` and add one line to the slug → component block. (Astro must see a static tag to hydrate an island, which is why this is not a map lookup.)
4. `pnpm build` — the page, sitemap entry and JSON-LD are generated automatically.

## Before you deploy

- `src/config.ts`: set `SITE.url` to your domain (drives canonical URLs + sitemap), plus name/contact email.
- `public/robots.txt`: update the Sitemap URL.
- Deploy `dist/` to Cloudflare Pages, Vercel or Netlify (all free for static sites). Build command `pnpm build`, output dir `dist`.

## Turning on ads

1. Apply for Google AdSense once the site is live with the privacy/terms/about/contact pages in place.
2. In `src/config.ts` set `ADS.enabled = true`, `ADS.adsenseClient = 'ca-pub-…'`, and fill `ADS.slots` with the slot IDs you create in the AdSense dashboard (`headerBanner`, `inToolTop`, `inToolBottom`, `sidebar`).
3. Rebuild. `AdSlot.astro` swaps the dashed placeholders for real `<ins class="adsbygoogle">` units.

Once you pass ~50k sessions/month, apply to a premium network (Raptive, Mediavine/Journey, Ezoic) — RPMs are typically 3–5× AdSense.
