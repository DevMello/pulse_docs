import fs from 'node:fs';
import path from 'node:path';
import { Shell } from '../shell';

export default function PrivacyPage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'content', 'privacy.html'), 'utf8');
  return (
    <Shell currentPath="/privacy/">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Shell>
  );
}
