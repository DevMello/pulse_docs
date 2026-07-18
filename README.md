# Pulse SDK — Documentation

A statically-built documentation site for the [Pulse](https://github.com/DevMello/pulse) SDK,
written with **Next.js** (App Router, `output: 'export'`) and designed to be deployed to
**GitHub Pages**. It matches the Pulse product's design system — same tokens, fonts, dark/light
theme, and the EKG mark.

The site covers every SDK feature across a handful of routes: the ~1 KB script tag, the typed
`@pulse/sdk` npm package, framework adapters (React, Vue, Svelte), custom events, revenue
tracking, the MCP server and agent skill, privacy controls, the wire format, and the
HTTP/validation reference.

---

## Local development

```sh
npm install
npm run dev          # http://localhost:3000
```

Produce the static site:

```sh
npm run build        # emits ./out — plain HTML/CSS/JS, no server needed
npm run serve        # preview ./out locally via `npx serve`
```

---

## Deploy to GitHub Pages

Deployment is automated by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Push this project to a GitHub repository.
2. In the repo, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).

The workflow installs dependencies, runs the static export, and publishes `out/`. The
`actions/configure-pages` step computes the correct **base path** automatically, so the site
works whether it's served from:

- a **project page** — `https://<user>.github.io/<repo>/` (base path `/<repo>`), or
- a **user/org page** — `https://<user>.github.io/` (no base path).

You never hard-code the repo name; `next.config.ts` reads it from the `BASE_PATH` env var that the
workflow provides.

### Deploying somewhere other than GitHub Pages

`npm run build` produces a portable `out/` directory. Drop it on any static host — Netlify,
Cloudflare Pages, S3, nginx. If it's served from a subpath, set `BASE_PATH` at build time:

```sh
BASE_PATH=/docs npm run build
```

---

## Project layout

Each documentation page is a pair: a `content/<slug>.html` fragment holding the prose, and an
`app/<slug>/page.tsx` that reads it at build time and renders it inside the shared shell. The
`.tsx` files are near-identical 12-line stubs; all the writing happens in `content/`.

| Path | What it is |
|---|---|
| `content/*.html` | The documentation markup — one fragment per page. This is what you edit. |
| `app/<slug>/page.tsx` | Reads `content/<slug>.html` at build time and renders it in the shell. |
| `app/page.tsx` | The index route (`/`). Reads `content/introduction.html` — the one filename that doesn't match its route. |
| `app/shell.tsx` | Page frame — topbar, sidebar, on-this-page TOC, footer. |
| `app/lib/nav.ts` | `SIDEBAR_GROUPS` (sidebar) and `PAGE_TOC` (on-this-page), both hand-maintained. |
| `app/search.tsx` | Client component: the ⌘K search dialog, backed by Fuse.js. |
| `app/enhance.tsx` | Client component: theme toggle, copy buttons, syntax highlighting, scrollspy, mobile nav. |
| `app/layout.tsx` | HTML shell — fonts, metadata, and the pre-paint theme script. |
| `app/globals.css` | The Pulse design tokens and all page styles. |
| `scripts/build-search-index.mjs` | Emits `public/search-index.json` from `content/`. Runs before every `dev` and `build`. |
| `next.config.ts` | Static export + GitHub Pages base path. |
| `.github/workflows/deploy.yml` | Build-and-publish to Pages. |

### Editing the content

The documentation body is plain HTML in [`content/`](content). Code samples use
`<pre class="code" data-lang="ts">…</pre>`; the client component adds the language label, copy
button, and highlighting at runtime. Design tokens and layout live in
[`app/globals.css`](app/globals.css).

### Adding a page

Nothing is auto-discovered — a new page has to be registered in four places, and skipping any one
of them fails quietly rather than loudly. Commit
[`2d9fd63`](https://github.com/DevMello/pulse_docs/commit/2d9fd63) adds the MCP page and is a
worked example of all four.

1. **Write `content/<slug>.html`.** A sequence of `<section>` blocks, each opening with
   `<h2 id="…">Title<a class="anchor" href="#…">#</a></h2>`. Those `id`s are the anchors
   everything else refers to.
2. **Create `app/<slug>/page.tsx`.** Copy any existing one; change the filename it reads and the
   `currentPath` you hand to `<Shell>`. `currentPath` must include the trailing slash — it's the
   key `PAGE_TOC` is looked up by, and a mismatch silently renders no on-this-page nav.
3. **Register it in [`app/lib/nav.ts`](app/lib/nav.ts).** Add a `SIDEBAR_GROUPS` entry (or extend
   an existing group) so it appears in the sidebar, and a `PAGE_TOC` entry listing the `h2`
   anchors for the right-hand rail.
4. **Add it to `PAGE_META` in [`scripts/build-search-index.mjs`](scripts/build-search-index.mjs).**
   The indexer walks that map, not the directory, so a page missing from it builds and renders
   perfectly but never appears in search.

Then run `npm run dev` and confirm the page renders, the sidebar link works, and the title turns
up in ⌘K search.

---

MIT licensed, like Pulse itself.
