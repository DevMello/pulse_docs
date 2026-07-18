import fs from 'node:fs';
import path from 'node:path';
import { Shell } from '../shell';

export default function ScriptTagPage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'content', 'script-tag.html'), 'utf8');
  return (
    <Shell currentPath="/script-tag/">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Shell>
  );
}
