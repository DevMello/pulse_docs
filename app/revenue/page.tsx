import fs from 'node:fs';
import path from 'node:path';
import { Shell } from '../shell';

export default function RevenuePage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'content', 'revenue.html'), 'utf8');
  return (
    <Shell currentPath="/revenue/">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Shell>
  );
}
