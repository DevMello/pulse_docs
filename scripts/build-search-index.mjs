import fs from 'node:fs';
import path from 'node:path';
import Fuse from 'fuse.js';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const OUT_FILE = path.join(process.cwd(), 'public', 'search-index.json');

const PAGE_META = {
  'introduction': { href: '/', page: 'Introduction', group: 'Getting started' },
  'quick-start': { href: '/quick-start/', page: 'Quick start', group: 'Getting started' },
  'mcp': { href: '/mcp/', page: 'AI assistants', group: 'AI assistants' },
  'script-tag': { href: '/script-tag/', page: 'The script tag', group: 'The script tag' },
  'npm': { href: '/npm/', page: 'The npm package', group: 'The npm package' },
  'concepts': { href: '/concepts/', page: 'Concepts', group: 'Concepts' },
  'revenue': { href: '/revenue/', page: 'Revenue tracking', group: 'Concepts' },
  'frameworks': { href: '/frameworks/', page: 'Frameworks', group: 'Frameworks' },
  'privacy': { href: '/privacy/', page: 'Privacy & filtering', group: 'Privacy & filtering' },
  'reference': { href: '/reference/', page: 'Reference', group: 'Reference' },
  'guides': { href: '/guides/', page: 'Guides', group: 'Guides' },
};

function stripTags(html) {
  return html
    .replace(/<a\s[^>]*>#?<\/a>/g, '')
    .replace(/<code>/g, '')
    .replace(/<\/code>/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseHeadings(html) {
  const headings = [];
  const h2re = /<h2\s+id="([^"]*)"[^>]*>(.*?)<\/h2>/gi;
  const h3re = /<h3[^>]*>(.*?)<\/h3>/gi;

  let m;
  const headingPositions = [];

  while ((m = h2re.exec(html))) {
    headingPositions.push({
      index: m.index,
      level: 2,
      id: m[1],
      text: stripTags(m[2]),
    });
  }
  while ((m = h3re.exec(html))) {
    headingPositions.push({
      index: m.index,
      level: 3,
      id: '',
      text: stripTags(m[1]),
    });
  }

  headingPositions.sort((a, b) => a.index - b.index);

  for (let i = 0; i < headingPositions.length; i++) {
    const h = headingPositions[i];
    const start = h.index;
    const end = i + 1 < headingPositions.length ? headingPositions[i + 1].index : html.length;
    const bodyHtml = html.slice(start, end);
    const bodyText = stripTags(bodyHtml);

    const entry = {
      title: h.text,
      id: h.id,
      level: h.level,
      text: bodyText,
    };
    headings.push(entry);
  }

  return headings;
}

const entries = [];

for (const [slug, meta] of Object.entries(PAGE_META)) {
  const filePath = path.join(CONTENT_DIR, `${slug}.html`);
  if (!fs.existsSync(filePath)) {
    console.warn(`Missing content file: ${slug}.html`);
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const headings = parseHeadings(html);

  if (headings.length === 0) {
    entries.push({
      title: meta.page,
      page: meta.group,
      href: meta.href,
      text: stripTags(html).slice(0, 300),
    });
  } else {
    for (const h of headings) {
      const href = h.id ? `${meta.href}#${h.id}` : meta.href;
      entries.push({
        title: h.title,
        page: meta.page,
        href,
        text: h.text.slice(0, 300),
      });
    }
  }
}

const options = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'text', weight: 1 },
    { name: 'page', weight: 1.5 },
  ],
  includeScore: true,
  threshold: 0.4,
  distance: 200,
};

const index = Fuse.createIndex(options.keys, entries);
const payload = {
  options,
  index: index.toJSON(),
  documents: entries,
};

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(payload), 'utf8');
console.log(`Search index written to ${OUT_FILE} (${entries.length} entries)`);
