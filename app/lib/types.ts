/** Shared types used by both server (content.ts) and client (chrome/search). */

export interface PageMeta {
  slug: string;
  href: string;
  title: string;
  navLabel: string;
  group: string;
  file: string;
  lead?: string;
  /** The intro page carries the full hero, so it renders no page-head. */
  hero?: boolean;
}

export interface NavItem {
  href: string;
  label: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export interface SearchEntry {
  /** Heading (or page) title. */
  title: string;
  /** Human label for where it lives — the page title, or the group for a page entry. */
  page: string;
  /** Destination, e.g. "/script-tag/#data-attributes". */
  href: string;
  /** A short snippet of the section's prose, for matching and preview. */
  text: string;
}

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}
