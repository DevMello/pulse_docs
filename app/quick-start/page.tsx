import fs from 'node:fs';
import path from 'node:path';
import { Shell } from '../shell';

export default function QuickStartPage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'content', 'quick-start.html'), 'utf8');
  return (
    <Shell currentPath="/quick-start/">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Shell>
  );
}
