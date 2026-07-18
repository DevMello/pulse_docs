import fs from 'node:fs';
import path from 'node:path';

/**
 * The documentation body.
 *
 * The markup lives in `content.html` and is read at build time (this is a
 * Server Component, so `fs` runs during `next build` / export and the string is
 * inlined into the static HTML). Keeping it as raw HTML rather than JSX means
 * the hand-tuned markup stays byte-for-byte what was designed, and the
 * interactive layer in `enhance.tsx` progressively upgrades it on the client —
 * exactly like a plain static page, just built and deployed by Next.
 */
export default function Page() {
  const content = fs.readFileSync(path.join(process.cwd(), 'app', 'content.html'), 'utf8');
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
