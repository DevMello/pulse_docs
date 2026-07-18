import type { Metadata } from 'next';
import './globals.css';
import { Enhance } from './enhance';

export const metadata: Metadata = {
  title: 'Pulse SDK — Documentation',
  description:
    'Complete reference for the Pulse SDK: the ~1 KB script tag, the typed @pulse/sdk npm package, framework adapters for React, Vue and Svelte, custom events, revenue tracking, privacy controls and the wire format.',
};

/**
 * Pre-paint theme resolve — same contract as the Pulse app: stored choice
 * first, OS preference otherwise. Inlined so it runs before the first paint and
 * can't flash the wrong theme. Shares the 'pulse-theme' key with the dashboard.
 */
const themeInit = `try{var t=localStorage.getItem('pulse-theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the script below stamps data-theme on <html>
    // before React hydrates, and that one attribute is expected to differ.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {children}
        <Enhance />
      </body>
    </html>
  );
}
