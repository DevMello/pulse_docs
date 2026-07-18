import fs from 'node:fs';
import path from 'node:path';
import { Shell } from '../shell';

export default function GuidesPage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'content', 'guides.html'), 'utf8');
  return (
    <Shell currentPath="/guides/">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Shell>
  );
}
