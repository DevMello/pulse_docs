import type { NextConfig } from 'next';

/**
 * Static export for GitHub Pages.
 *
 * `output: 'export'` makes `next build` emit a fully static site into `out/`,
 * with no Node server required — exactly what GitHub Pages serves.
 *
 * `basePath` is driven by the BASE_PATH env var so the same build works both
 * locally (empty → served from `/`) and on a GitHub *project* page, where the
 * site lives under `/<repo-name>/`. The deploy workflow passes the value that
 * `actions/configure-pages` computes, so you never hard-code your repo name.
 */
const basePath = process.env.BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages can't run Next's image optimizer.
  images: { unoptimized: true },
  // Emit `about/index.html` rather than `about.html`, which Pages resolves
  // more predictably under a subpath.
  trailingSlash: true,
  basePath: basePath || undefined,
  // Content-only site: linting is not part of the deploy gate. Type-checking
  // still runs.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
