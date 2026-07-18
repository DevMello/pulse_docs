import fs from 'node:fs';
import path from 'node:path';
import { Shell } from '../shell';

export default function NpmPage() {
  const content = fs.readFileSync(path.join(process.cwd(), 'content', 'npm.html'), 'utf8');
  return (
    <Shell currentPath="/npm/">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Shell>
  );
}
