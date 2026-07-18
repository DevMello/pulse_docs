'use client';

import { useEffect, useRef, useState } from 'react';
import Fuse from 'fuse.js';

interface SearchEntry {
  title: string;
  page: string;
  href: string;
  text: string;
}

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchEntry> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

  useEffect(() => {
    fetch(`${BASE_PATH}/search-index.json`)
      .then((r) => r.json())
      .then((data) => {
        const f = new Fuse<SearchEntry>(
          data.documents,
          data.options,
          Fuse.parseIndex(data.index),
        );
        setFuse(f);
      });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      return;
    }
    const res = fuse.search(query.trim());
    setResults(res.slice(0, 12).map((r) => r.item));
  }, [query, fuse]);

  return (
    <>
      <button
        ref={btnRef}
        className="iconbtn searchbtn"
        onClick={() => setOpen(true)}
        aria-label="Search docs"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7.5"/>
          <path d="M17 17l4 4"/>
        </svg>
      </button>

      {open && (
        <div className="search-overlay" onClick={() => setOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-input-wrap">
              <svg className="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7.5"/>
                <path d="M17 17l4 4"/>
              </svg>
              <input
                ref={inputRef}
                className="search-input"
                type="text"
                placeholder="Search docs…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd className="search-esc">ESC</kbd>
            </div>

            {results.length > 0 && (
              <ul className="search-results">
                {results.map((r, i) => (
                  <li key={i}>
                    <a href={`${BASE_PATH}${r.href}`} onClick={() => setOpen(false)}>
                      <span className="search-result-title">{r.title}</span>
                      <span className="search-result-page">{r.page}</span>
                      <span className="search-result-text">{r.text.slice(0, 120)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {query.trim() && results.length === 0 && (
              <p className="search-empty">No results for &ldquo;{query}&rdquo;</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
