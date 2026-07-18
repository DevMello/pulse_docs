import fs from 'node:fs';
import path from 'node:path';
import { Shell } from '../shell';

export default function ReferencePage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'content', 'reference.html'), 'utf8');
  return (
    <Shell currentPath="/reference/">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Shell>
  );
}
