import fs from 'node:fs';
import path from 'node:path';
import { Shell } from '../shell';

export default function FrameworksPage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'content', 'frameworks.html'), 'utf8');
  return (
    <Shell currentPath="/frameworks/">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Shell>
  );
}
