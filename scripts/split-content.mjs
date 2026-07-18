import fs from 'node:fs';

const html = fs.readFileSync('app/content.html', 'utf8');
const mainInner = html.slice(
  html.indexOf('<main class="content">') + '<main class="content">'.length,
  html.indexOf('</main>')
);

// Non-nested <section> blocks.
const sections = [...mainInner.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)].map((m) => m[0]);

const firstId = (s) => (s.match(/id="([^"]+)"/) || [])[1];

// section id -> page slug
const MAP = {
  introduction: 'introduction', overview: 'introduction', 'install-choices': 'introduction',
  quickstart: 'quick-start',
  'script-tag': 'script-tag', 'data-attributes': 'script-tag', 'pulse-global': 'script-tag', 'async-stub': 'script-tag',
  'install-npm': 'npm', api: 'npm', config: 'npm', types: 'npm',
  frameworks: 'frameworks', react: 'frameworks', nextjs: 'frameworks', vue: 'frameworks', svelte: 'frameworks',
  pageviews: 'concepts', events: 'concepts',
  revenue: 'revenue',
  optout: 'privacy', filtering: 'privacy', domains: 'privacy',
  'wire-format': 'reference', enrichment: 'reference', responses: 'reference', limits: 'reference',
  recipes: 'guides', faq: 'guides',
};

const buckets = {};
const report = [];
for (const sec of sections) {
  const id = firstId(sec);
  const slug = MAP[id];
  if (!slug) { report.push(`UNMAPPED: ${id}`); continue; }
  // Strip the group eyebrow label (redundant with the page title) and stray hrs.
  const cleaned = sec.replace(/\s*<p class="eyebrow">[\s\S]*?<\/p>/g, '').trim();
  (buckets[slug] ||= []).push(cleaned);
  report.push(`${id.padEnd(16)} -> ${slug}`);
}

for (const [slug, secs] of Object.entries(buckets)) {
  fs.writeFileSync(`content/${slug}.html`, secs.join('\n\n') + '\n');
}

console.log(report.join('\n'));
console.log('\nWROTE:', Object.keys(buckets).map((s) => `${s}(${buckets[s].length})`).join(' '));
