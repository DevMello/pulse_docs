export interface SidebarItem {
  label: string;
  href: string;
  hash?: string;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export interface TocLink {
  hash: string;
  label: string;
}

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    title: 'Getting started',
    items: [
      { label: 'Introduction', href: '/' },
      { label: 'Quick start', href: '/quick-start/' },
    ],
  },
  {
    title: 'The script tag',
    items: [
      { label: 'Adding the script', href: '/script-tag/', hash: 'script-tag' },
      { label: 'data-* attributes', href: '/script-tag/', hash: 'data-attributes' },
      { label: 'The pulse() function', href: '/script-tag/', hash: 'pulse-global' },
      { label: 'Calling before load', href: '/script-tag/', hash: 'async-stub' },
    ],
  },
  {
    title: 'The npm package',
    items: [
      { label: 'Install', href: '/npm/', hash: 'install-npm' },
      { label: 'Core API', href: '/npm/', hash: 'api' },
      { label: 'Configuration', href: '/npm/', hash: 'config' },
      { label: 'Types', href: '/npm/', hash: 'types' },
    ],
  },
  {
    title: 'Concepts',
    items: [
      { label: 'Pageviews & SPA routing', href: '/concepts/', hash: 'pageviews' },
      { label: 'Custom events', href: '/concepts/', hash: 'events' },
      { label: 'Revenue tracking', href: '/revenue/' },
    ],
  },
  {
    title: 'Frameworks',
    items: [
      { label: 'Overview', href: '/frameworks/', hash: 'frameworks' },
      { label: 'React', href: '/frameworks/', hash: 'react' },
      { label: 'Next.js App Router', href: '/frameworks/', hash: 'nextjs' },
      { label: 'Vue', href: '/frameworks/', hash: 'vue' },
      { label: 'Svelte / SvelteKit', href: '/frameworks/', hash: 'svelte' },
    ],
  },
  {
    title: 'Privacy & filtering',
    items: [
      { label: 'Opt-out & DNT', href: '/privacy/', hash: 'optout' },
      { label: 'Excludes, localhost, bots', href: '/privacy/', hash: 'filtering' },
      { label: 'Domain allow-list', href: '/privacy/', hash: 'domains' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { label: 'Wire format', href: '/reference/', hash: 'wire-format' },
      { label: 'Server enrichment', href: '/reference/', hash: 'enrichment' },
      { label: 'HTTP responses', href: '/reference/', hash: 'responses' },
      { label: 'Limits & validation', href: '/reference/', hash: 'limits' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { label: 'Recipes', href: '/guides/', hash: 'recipes' },
      { label: 'Troubleshooting & FAQ', href: '/guides/', hash: 'faq' },
    ],
  },
];

export const PAGE_TOC: Record<string, TocLink[]> = {
  '/': [
    { hash: 'overview', label: 'What the SDK does' },
    { hash: 'install-choices', label: 'Script tag vs. npm' },
  ],
  '/quick-start/': [
    { hash: 'quickstart', label: 'Quick start' },
  ],
  '/script-tag/': [
    { hash: 'script-tag', label: 'Adding the script' },
    { hash: 'data-attributes', label: 'data-* attributes' },
    { hash: 'pulse-global', label: 'The pulse() function' },
    { hash: 'async-stub', label: 'Calling before load' },
  ],
  '/npm/': [
    { hash: 'install-npm', label: 'Install @pulse/sdk' },
    { hash: 'api', label: 'Core API' },
    { hash: 'config', label: 'Configuration options' },
    { hash: 'types', label: 'TypeScript types' },
  ],
  '/concepts/': [
    { hash: 'pageviews', label: 'Pageviews & SPA routing' },
    { hash: 'events', label: 'Custom events' },
  ],
  '/revenue/': [
    { hash: 'revenue', label: 'Revenue tracking' },
  ],
  '/frameworks/': [
    { hash: 'frameworks', label: 'Overview' },
    { hash: 'react', label: 'React' },
    { hash: 'nextjs', label: 'Next.js App Router' },
    { hash: 'vue', label: 'Vue' },
    { hash: 'svelte', label: 'Svelte / SvelteKit' },
  ],
  '/privacy/': [
    { hash: 'optout', label: 'Opt-out & Do Not Track' },
    { hash: 'filtering', label: 'Excludes, localhost & bots' },
    { hash: 'domains', label: 'Domain allow-list' },
  ],
  '/reference/': [
    { hash: 'wire-format', label: 'Wire format' },
    { hash: 'enrichment', label: 'What the server does' },
    { hash: 'responses', label: 'HTTP responses' },
    { hash: 'limits', label: 'Limits & validation' },
  ],
  '/guides/': [
    { hash: 'recipes', label: 'Recipes' },
    { hash: 'faq', label: 'Troubleshooting & FAQ' },
  ],
};

export const TOPNAV_LINKS = [
  { label: 'Quick start', href: '/quick-start/' },
  { label: 'API', href: '/npm/#api' },
  { label: 'Frameworks', href: '/frameworks/' },
];
