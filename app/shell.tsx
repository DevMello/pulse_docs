import type { ReactNode } from 'react';
import Link from 'next/link';
import { SIDEBAR_GROUPS, PAGE_TOC, type TocLink } from './lib/nav';
import { Search } from './search';

interface ShellProps {
  currentPath: string;
  children: ReactNode;
}

function itemHref(item: { href: string; hash?: string }): string {
  return item.hash ? `${item.href}#${item.hash}` : item.href;
}

export function Shell({ currentPath, children }: ShellProps) {
  const tocLinks: TocLink[] = PAGE_TOC[currentPath] ?? [];

  return (
    <>
      <header className="topbar">
        <button className="iconbtn menubtn" id="menubtn" aria-label="Toggle navigation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <Link className="brandlink" href="/">
          <svg width="24" height="24" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <rect x="0.5" y="0.5" width="35" height="35" rx="9" fill="var(--color-brand-50)" stroke="var(--color-brand-200)"/>
            <path d="M7 21.5h5l2.5-8 4 13 3.5-13 2 8H29" stroke="var(--color-brand-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Pulse <span className="badge">SDK</span>
        </Link>
        <div className="topbar-spacer"></div>
        <nav className="topnav" aria-label="Site">
          <Link className="hide-sm" href="/quick-start/">Quick start</Link>
          <Link className="hide-sm" href="/npm/#api">API</Link>
          <Link className="hide-sm" href="/frameworks/">Frameworks</Link>
          <a href="https://github.com/DevMello/pulse" rel="noopener">GitHub</a>
        </nav>
        <Search />
        <button className="iconbtn" id="themebtn" aria-label="Toggle theme">
          <svg data-hide-dark viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>
          <svg data-hide-light viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
        </button>
      </header>

      <div className="scrim" id="scrim"></div>

      <div className="shell" id="top">
        <aside className="sidebar" id="sidebar">
          {SIDEBAR_GROUPS.map((group) => (
            <div className="sb-group" key={group.title}>
              <h4>{group.title}</h4>
              {group.items.map((item) => {
                const href = itemHref(item);
                const isCurrent =
                  item.hash
                    ? currentPath === item.href
                    : currentPath === item.href;
                return (
                  <Link
                    key={item.label}
                    href={href}
                    className={isCurrent ? 'active' : ''}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </aside>

        <main className="content">
          {children}
        </main>

        {tocLinks.length > 0 && (
          <nav className="toc" aria-label="On this page" id="toc">
            <h5>On this page</h5>
            {tocLinks.map((link) => (
              <a key={link.hash} href={`#${link.hash}`}>{link.label}</a>
            ))}
          </nav>
        )}
      </div>

      <footer className="footer">
        Pulse SDK · MIT licensed · <a href="https://github.com/DevMello/pulse" rel="noopener">github.com/DevMello/pulse</a> · No cookies were set in the making of this page.
      </footer>
    </>
  );
}
