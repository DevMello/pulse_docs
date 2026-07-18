# Pulse SDK — Documentation

A statically-built documentation site for the [Pulse](https://github.com/DevMello/pulse) SDK,
written with **Next.js** (App Router, `output: 'export'`) and designed to be deployed to
**GitHub Pages**. It matches the Pulse product's design system — same tokens, fonts, dark/light
theme, and the EKG mark.

The site is a single documentation page covering every SDK feature: the ~1 KB script tag, the
typed `@pulse/sdk` npm package, framework adapters (React, Vue, Svelte), custom events, revenue
tracking, privacy controls, the wire format, and the HTTP/validation reference.

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

| Path | What it is |
|---|---|
| `app/layout.tsx` | HTML shell — fonts, metadata, and the pre-paint theme script. |
| `app/page.tsx` | Reads `content.html` at build time and renders it. |
| `app/content.html` | The documentation markup. |
| `app/enhance.tsx` | Client component: theme toggle, copy buttons, syntax highlighting, scrollspy, mobile nav. |
| `app/globals.css` | The Pulse design tokens and all page styles. |
| `next.config.ts` | Static export + GitHub Pages base path. |
| `.github/workflows/deploy.yml` | Build-and-publish to Pages. |

### Editing the content

The documentation body is plain HTML in [`app/content.html`](app/content.html). Code samples use
`<pre class="code" data-lang="ts">…</pre>`; the client component adds the language label, copy
button, and highlighting at runtime. Design tokens and layout live in
[`app/globals.css`](app/globals.css).

---

MIT licensed, like Pulse itself.
