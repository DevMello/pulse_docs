import fs from 'node:fs';
import path from 'node:path';
import { Shell } from './shell';

export default function HomePage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'content', 'introduction.html'), 'utf8');
  return (
    <Shell currentPath="/">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Shell>
  );
}
