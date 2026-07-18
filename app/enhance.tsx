'use client';

import { useEffect } from 'react';

/**
 * Client-side progressive enhancement for the static documentation body:
 * theme toggle, mobile nav, copy buttons, lightweight syntax highlighting, and
 * scrollspy for both nav rails. It operates on the DOM produced by the
 * `dangerouslySetInnerHTML` content, so it's the same code that ran as an inline
 * <script> in the single-file version — just typed and lifecycle-managed.
 */

const LANG_LABELS: Record<string, string> = {
  ts: 'TypeScript',
  tsx: 'TSX',
  js: 'JavaScript',
  jsx: 'JSX',
  html: 'HTML',
  bash: 'Shell',
  sh: 'Shell',
  svelte: 'Svelte',
  text: 'Text',
  sql: 'SQL',
};

const KW =
  /\b(import|from|export|default|const|let|var|function|return|if|else|new|void|typeof|async|await|true|false|null|undefined|npm|npx|pnpm|yarn|bun|add|POST|GET)\b/g;

const COPY_ICON =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function segment(text: string, lang: string): string {
  let e = esc(text);
  if (lang === 'html' || lang === 'svelte') {
    e = e.replace(/(&lt;\/?)([a-zA-Z][\w-]*)/g, '$1<span class="t-tag">$2</span>');
    e = e.replace(/([a-zA-Z-]+)(=)/g, '<span class="t-attr">$1</span>$2');
    return e;
  }
  e = e.replace(/\b(0x[0-9a-fA-F]+|\d[\d_]*(?:\.\d+)?)\b/g, '<span class="t-num">$1</span>');
  e = e.replace(KW, '<span class="t-kw">$1</span>');
  return e;
}

function commentRe(lang: string): string {
  if (lang === 'bash' || lang === 'sh') return '#[^\\n]*';
  if (lang === 'sql') return '--[^\\n]*';
  if (lang === 'html') return '&lt;!--[\\s\\S]*?--&gt;';
  if (lang === 'text') return '';
  return '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/';
}

function highlight(code: string, lang: string): string {
  const cRe = commentRe(lang);
  const strRe = '`(?:\\\\.|[^`\\\\])*`|"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'';
  const parts = cRe ? '(' + cRe + ')|(' + strRe + ')' : '()(' + strRe + ')';
  const master = new RegExp(parts, 'g');
  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = master.exec(code))) {
    out += segment(code.slice(last, m.index), lang);
    if (m[1]) out += '<span class="t-com">' + esc(m[1]) + '</span>';
    else out += '<span class="t-str">' + esc(m[2]) + '</span>';
    last = master.lastIndex;
    if (m.index === master.lastIndex) master.lastIndex++; // guard empty match
  }
  out += segment(code.slice(last), lang);
  return out;
}

function enhance(): void {
  const root = document.documentElement;
  const body = document.body;

  // ---- theme toggle (shares the 'pulse-theme' key with the Pulse app) ------
  document.getElementById('themebtn')?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('pulse-theme', next);
    } catch {
      /* storage may be blocked */
    }
  });

  // ---- mobile nav ----------------------------------------------------------
  const closeNav = () => body.classList.remove('nav-open');
  document.getElementById('menubtn')?.addEventListener('click', () => body.classList.toggle('nav-open'));
  document.getElementById('scrim')?.addEventListener('click', closeNav);
  document.getElementById('sidebar')?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).tagName === 'A') closeNav();
  });

  // ---- wrap code blocks: header + copy button + highlight ------------------
  document.querySelectorAll<HTMLPreElement>('pre.code').forEach((pre) => {
    const lang = pre.getAttribute('data-lang') || 'text';
    const raw = pre.querySelector('code')?.textContent ?? '';

    const wrap = document.createElement('div');
    wrap.className = 'code';

    const head = document.createElement('div');
    head.className = 'code-head';
    const label = document.createElement('span');
    label.className = 'code-lang';
    label.textContent = LANG_LABELS[lang] || lang;
    const btn = document.createElement('button');
    btn.className = 'copybtn';
    btn.type = 'button';
    btn.innerHTML = COPY_ICON + '<span>Copy</span>';
    head.append(label, btn);

    const bodyEl = document.createElement('pre');
    bodyEl.className = 'code-body';
    const newCode = document.createElement('code');
    try {
      newCode.innerHTML = highlight(raw, lang);
    } catch {
      newCode.textContent = raw;
    }
    bodyEl.appendChild(newCode);

    wrap.append(head, bodyEl);
    pre.replaceWith(wrap);

    btn.addEventListener('click', () => {
      navigator.clipboard
        .writeText(raw)
        .then(() => {
          btn.classList.add('ok');
          const span = btn.querySelector('span');
          if (span) span.textContent = 'Copied';
          setTimeout(() => {
            btn.classList.remove('ok');
            const s = btn.querySelector('span');
            if (s) s.textContent = 'Copy';
          }, 1600);
        })
        .catch(() => {
          /* clipboard blocked; code is still selectable */
        });
    });
  });

  // ---- sidebar hash-item highlighting ------------------------------------
  const sidebarLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.sidebar a[href*="#"]'));

  const setSidebarFromHash = (hash: string) => {
    sidebarLinks.forEach((a) => {
      const linkHash = a.getAttribute('href')?.split('#')[1];
      a.classList.toggle('active', linkHash === hash);
    });
  };

  const hashFromLocation = () => location.hash.slice(1);
  const currentHash = hashFromLocation();
  if (currentHash) setSidebarFromHash(currentHash);

  window.addEventListener('hashchange', () => setSidebarFromHash(hashFromLocation()));

  // ---- scrollspy for toc --------------------------------------------------
  const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.toc a[href^="#"]'));
  const idOf = (a: HTMLAnchorElement) => (a.getAttribute('href') || '').slice(1);

  const seen = new Set<string>();
  tocLinks.forEach((a) => {
    const id = idOf(a);
    if (id && document.getElementById(id)) seen.add(id);
  });
  const els = Array.from(seen)
    .map((id) => document.getElementById(id))
    .filter((x): x is HTMLElement => x !== null);

  const setActive = (id: string) => {
    tocLinks.forEach((a) => a.classList.toggle('active', idOf(a) === id));
    sidebarLinks.forEach((a) => {
      const linkHash = a.getAttribute('href')?.split('#')[1];
      a.classList.toggle('active', linkHash === id);
    });
  };

  let current: string | null = null;
  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length) {
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0].target.id;
        if (id !== current) {
          current = id;
          setActive(id);
        }
      }
    },
    { rootMargin: '-70px 0px -70% 0px', threshold: 0 },
  );
  els.forEach((el) => obs.observe(el));
}

export function Enhance() {
  useEffect(() => {
    // React Strict Mode runs effects twice in dev; the code-block transform is
    // one-shot (it replaces the source nodes), so guard against a second pass.
    const w = window as unknown as { __pulseDocsEnhanced?: boolean };
    if (w.__pulseDocsEnhanced) return;
    w.__pulseDocsEnhanced = true;
    enhance();
  }, []);
  return null;
}
