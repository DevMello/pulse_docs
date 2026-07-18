import fs from 'node:fs';
import path from 'node:path';
import { Shell } from '../shell';

export default function ConceptsPage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'content', 'concepts.html'), 'utf8');
  return (
    <Shell currentPath="/concepts/">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Shell>
  );
}
